
import type { ApiResponse } from "../../../shared/types/apiResponse";

export default defineEventHandler(async (e) => {
  console.log("Registering new user...");
  const body = await readBody(e);
  const username = body.username.toLowerCase() as string;

  if (!username || !body.password) {
    console.log("Username and password are required.");
    setResponseStatus(e, 400, "Username and password are required");
    return {
      message: "Username and password are required",
      success: false,
    } as ApiResponse;
  }
  if (username.length < 6 || body.password.length < 6) {
    console.log("Invalid lengths");
    setResponseStatus(e, 400, "Username and password must be of valid length (> 6 characters)");
    return {
      message: "Username and password must be of valid length (> 6 characters)",
      success: false,
    } as ApiResponse;
  }
  const hashedPassword = await hashPassword(body.password as string);
  console.log("Verification complete... proceeding with user creation");

  let safeInsert = new User();
  console.log("Created stub user.", safeInsert)

  try {
    const existingUser = await User.query().username(username).first();
    if (existingUser) {
      console.log("User already exists with this username:", username);
      setResponseStatus(e, 409, "User already exists with this username");
      return {
        message: "User already exists with this username",
        success: false,
      } as ApiResponse;
    }

    console.log("Creating new user with username:", username);
    safeInsert = new User;
    safeInsert.username = username;
    safeInsert.password = hashedPassword;
    safeInsert.role = 'user';

    if (!await safeInsert.save()) {
      setResponseStatus(e, 500, "Failed to insert user");
      return {
        message: "Failed to insert user",
        success: false,
      } as ApiResponse;
    }
  } catch (error) {
    console.log((error as Error).message);
    setResponseStatus(e, 400, 'Error registering:' + (error as Error).message);
    return {
      message: 'Error registering: ' + (error as Error).message,
      success: false,
    } as ApiResponse;
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
    message: "User ID " + safeInsert.id + " registered successfully.",
    success: true,
  } as ApiResponse;
});
