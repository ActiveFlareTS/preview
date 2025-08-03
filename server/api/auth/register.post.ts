
export default defineEventHandler(async (e) => {
  console.log("Registering new user...");
  const body = await readBody(e);
  const username = body.username.toLowerCase() as string;

  if (!username || !body.password) {
    console.log("Username and password are required.");
    return setResponseStatus(e, 400, "Username and password are required");
  }
  if (username.length < 6 || body.password.length < 6) {
    console.log("Invalid lengths");
    return setResponseStatus(e, 400, "Username and password must be of valid length (> 6 characters)");
  }
  const hashedPassword = await hashPassword(body.password as string);
  console.log("Verification complete... proceeding with user creation");

  let safeInsert = new User();
  console.log("Created stub user.", safeInsert)

  try {
    const existingUser = await User.query().username(username).first();
    if (existingUser) {
      console.log("User already exists with this username:", username);
      return setResponseStatus(e, 409, "User already exists with this username");
    }

    console.log("Creating new user with username:", username);
    safeInsert = new User;
    safeInsert.username = username;
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
      username: username,
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
