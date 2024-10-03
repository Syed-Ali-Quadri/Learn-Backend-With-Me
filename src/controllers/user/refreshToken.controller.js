// Imports the modules.
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Importing dotenv module to load environment variables from a.env file.
dotenv.config({ path: "./.env" });

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    // Generating access token and refresh token.
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    // Saving the user with the updated refresh token.
    await user.save({ validateBeforeSave: false });

    // returning the user with the updated refresh token and access token.
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating access token or refresh token.");
  }
};

// refreshing the token if the verification is successful.
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Getting the refresh token from the cookie.
  const incomingRefreshToken = req.cookies.refreshToken;

  // If refresh token is not provided, return error.
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorization access.");
  }

  try {
    // Verifying the refresh token with the secret key.
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find user by refresh token.
    const user = await User.findById(decodedRefreshToken._id);

    // Check if user is authenticated
    if (!user) {
      throw new ApiError(401, "User not found.");
    }

    // Verifing the incoming refresh token with the refresh token in the database
    if (user?.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is expired or used.");
    }

    // initialize the cookie.
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    const { accessToken, newRefreshToken } = await generateTokens(user._id);

    // returning the loginUser data.
    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, options) // saving the refresh token in cookies section.
      .cookie("accessToken", accessToken, options) // saving the access token in cookies section.
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            newRefreshToken,
          },
          "Access token refreshed."
        )
      ); 
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

// Exporting the refreshAccessToken function.
export { refreshAccessToken };
