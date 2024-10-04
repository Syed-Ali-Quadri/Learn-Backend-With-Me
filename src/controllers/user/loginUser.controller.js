// Imports the modules.
import { asyncHandler } from "../../utils/asyncHandler.js"; // Utility to handle async functions and catch errors
import { ApiError } from "../../utils/ApiError.js"; // Custom error handling class
import { ApiResponse } from "../../utils/ApiResponse.js"; // Standardized API response structure
import { User } from "../../models/user.model.js"; // Importing the User model to interact with the database

// Helper function: Generate access and refresh tokens
// This function generates both tokens for the user and saves the refresh token to the database.
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    // 1. Find the user by their ID.
    const user = await User.findById(userId);

    // 2. Generate access and refresh tokens using methods defined in the User model.
    const accessToken = await user.generateAccessToken(); // Method to generate access token
    const refreshToken = await user.generateRefreshToken(); // Method to generate refresh token

    // 3. Save the refresh token to the user's database entry.
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // Skip validation before saving

    // 4. Return both tokens.
    return { accessToken, refreshToken };
  } catch (error) {
    // 5. Handle errors if token generation fails.
    throw new ApiError(500, "Error generating access token or refresh token.");
  }
};

// FEATURE: User login
// This function handles user login, verifying the username and password, and generating tokens.
const loginUser = asyncHandler(async (req, res) => {
  // 1. Extract username and password from the request body.
  const { username, password } = req.body;

  // 2. Validate that both username and password are provided.
  if ([username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All the fields must be required."); // Return an error if any field is missing.
  }

  // 3. Check if a user exists with the given username.
  const user = await User.findOne({ username });

  // 4. If the user does not exist, return an error.
  if (!user) throw new ApiError(400, "User not found.");

  // 5. Validate the provided password.
  const isPasswordValid = await user.isPasswordCorrect(password);

  // 6. If the password is incorrect, return an error.
  if (!isPasswordValid) throw new ApiError(401, "Incorrect password.");

  // 7. Generate access and refresh tokens using the helper function.
  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  // 8. Find the logged-in user, excluding password and refreshToken fields.
  const loggedIn = await User.findOne(user._id).select("-password -refreshToken");

  // 9. Set cookie options for storing tokens.
  const options = {
    httpOnly: true, // Prevents access from JavaScript
    secure: true, // Only transmit over HTTPS
    sameSite: "strict", // Protects against CSRF attacks
  };

  // 10. Send a response with tokens in cookies and user data in the response body.
  return res
    .status(200) // Success status code
    .cookie("refreshToken", refreshToken, options) // Store refresh token in a cookie
    .cookie("accessToken", accessToken, options) // Store access token in a cookie
    .json(new ApiResponse(200, { user: loggedIn, accessToken, refreshToken }, "User successfully logged in.")); // Success response
});

// Exporting the loginUser function
export { loginUser };

/*
Alternative implementation without asyncHandler:
const loginUser = async (req, res, next) => {
    try {
        // Your async logic...
    } catch (err) {
        next(err); // Manually pass the error to the next middleware
    }
};
*/
