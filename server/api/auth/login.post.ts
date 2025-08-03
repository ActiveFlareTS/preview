
import { ModelNotFoundError } from "sutando";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const username = body.username.toLowerCase() as string;
  const password = body.password as string;

  let user;
  try {
    let userQuery;
    try {
      userQuery = User.query();
    } catch (queryError) {
      console.log("User.query() failed:", queryError);
      throw queryError;
    }
    const usernameQuery = userQuery.username(username);

    user = await usernameQuery.first();

    if (!user) {
      console.log("User not found for username:", username);
      return setResponseStatus(e, 404, "User not found");
    }
    if (!await verifyPassword(user.password, password)) {
      console.log("Invalid password for user:", username);
      return setResponseStatus(e, 401, "Invalid password");
    }
  } catch (error) {
    if (error instanceof ModelNotFoundError) {
      console.log("ModelNotFoundError:", error);
      return setResponseStatus(e, 401, "Not authorized");
    }
    console.log("Database error:", error);
    return setResponseStatus(
      e,
      500,
      "An unexpected error occurred: " + (error as Error).message
    );
  }
  user = user as unknown as InstanceType<typeof User>;
  console.log("User found:", user);
  await setUserSession(e, {
    user: {
      id: user.id,
      username: username,
      role: user.role || "user",
      verified: user.isVerified(),
    },
    secure: {
      id: user.id,
      role: user?.role || "user",
      verified: user.isVerified(),
    },
    loggedInAt: Date.now(),
  });

  return { success: true, user: user, message: "User ID " + user.id + " logged in!" } as ApiResponse;
});
