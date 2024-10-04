// Imports the necessary modules.
import { asyncHandler } from "../../utils/asyncHandler.js"; // Utility to handle async functions and catch errors.
import { ApiError } from "../../utils/ApiError.js"; // Custom error handling class.
import { ApiResponse } from "../../utils/ApiResponse.js"; // Standardized API response structure.
import { User } from "../../models/user.model.js"; // Importing the User model to interact with the database.
import jwt from "jsonwebtoken"; // Importing jsonwebtoken for signing and verifying tokens.
import dotenv from "dotenv"; // Importing dotenv to load environment variables from a .env file.

// Loading environment variables from the .env file.
dotenv.config({ path: "./.env" });

// FEATURE: Function to generate new access and refresh tokens.
const generateTokens = async (userId) => {
  try {
    // 1. Fetch the user by their user ID.
    const user = await User.findById(userId);

    // 2. Generate new access and refresh tokens using methods defined in the User model.
    const accessToken = await user.generateAccessToken(); // Generate access token.
    const refreshToken = await user.generateRefreshToken(); // Generate refresh token.

    // 3. Set the new refresh token in the user's document in the database.
    user.refreshToken = refreshToken;

    // 4. Save the user with the updated refresh token, without validating other fields.
    await user.save({ validateBeforeSave: false });

    // 5. Return both the access and refresh tokens.
    return { accessToken, refreshToken };
  } catch (error) {
    // 6. Handle any errors that may occur during token generation.
    throw new ApiError(500, "Error generating access token or refresh token.");
  }
};

// FEATURE: Refresh the access token if the refresh token is valid.
const refreshAccessToken = asyncHandler(async (req, res) => {
  // 1. Get the refresh token from the cookies.
  const incomingRefreshToken = req.cookies.refreshToken;

  // 2. If no refresh token is provided, return an unauthorized access error.
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access.");
  }

  try {
    // 3. Verify the refresh token using the secret key from environment variables.
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // 4. Find the user associated with the refresh token.
    const user = await User.findById(decodedRefreshToken._id);

    // 5. If the user is not found, return an error.
    if (!user) {
      throw new ApiError(401, "User not found.");
    }

    // 6. Compare the incoming refresh token with the one stored in the database.
    if (user?.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is expired or used.");
    }

    // 7. Define the options for cookies (httpOnly, secure, and sameSite).
    const options = {
      httpOnly: true, // Cookie is accessible only by the web server.
      secure: true, // Cookie is sent over HTTPS only.
      sameSite: "strict", // Prevents CSRF by ensuring the cookie is only sent with same-site requests.
    };

    // 8. Generate new access and refresh tokens for the user.
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

    // 9. Return the new tokens, saving them in the cookies.
    return res
      .status(200) // Success status code.
      .cookie("refreshToken", newRefreshToken, options) // Set the new refresh token in the cookies.
      .cookie("accessToken", accessToken, options) // Set the new access token in the cookies.
      .json(
        new ApiResponse(
          200,
          {
            accessToken, // Send the new access token.
            newRefreshToken, // Send the new refresh token.
          },
          "Access token refreshed." // Success message.
        )
      );
  } catch (error) {
    // 10. If the token is invalid, return an error.
    throw new ApiError(401, "Invalid refresh token");
  }
});

// Exporting the refreshAccessToken function for external usage.
export { refreshAccessToken };
