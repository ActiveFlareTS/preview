
export default defineEventHandler(async (e) => {
  console.log("Registering new user...");
  const body = await readBody(e);
  const email = body.email.toLowerCase() as string;

  if (!email || !body.password) {
    console.log("Email and password are required.");
    return setResponseStatus(e, 400, "Email and password are required");
  }
  if (email.length < 5 || body.password.length < 6) {
    console.log("Invalid lengths");
    return setResponseStatus(e, 400, "Email and password must be of valid length");
  }
  const hashedPassword = await hashPassword(body.password as string);
  console.log("Verification complete... proceeding with user creation");

  let safeInsert = new User();
  console.log("Created stub user.", safeInsert)

  try {
    const existingUser = await User.query().email(email).first();
    if (existingUser) {
      console.log("User already exists with this email:", email);
      return setResponseStatus(e, 409, "User already exists with this email");
    }

    console.log("Creating new user with email:", email);
    safeInsert = new User;
    safeInsert.email = email;
    safeInsert.name = name;
    safeInsert.password = hashedPassword;
    safeInsert.role = 'user';

    if (!await safeInsert.save()) {
      return setResponseStatus(e, 500, "Failed to insert user");
    }
  } catch (error) {
    console.log((error as Error).message);
    return setResponseStatus(e, 400, 'Error registering:' + (error as Error).message);
  }

  await setUserSession(e, {
    user: {
      id: safeInsert.id,
      email: email,
      role: safeInsert.role,
      verified: safeInsert.isVerified(),
    },
    secure: {
      id: safeInsert.id,
      role: safeInsert.role,
      verified: safeInsert.isVerified(),
    },
    loggedInAt: Date.now(),
  });

  setResponseStatus(e, 200);
  return {
    message: "User registered successfully",
    success: true,
  } as ApiResponse;
});
