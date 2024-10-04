// Imports the necessary modules.
import { asyncHandler } from "../../utils/asyncHandler.js"; // Utility to handle async functions and catch errors
import { ApiResponse } from "../../utils/ApiResponse.js"; // Standardized API response structure
import { User } from "../../models/user.model.js"; // Importing the User model to interact with the database

// FEATURE: Logout user
// This function handles user logout by clearing their refresh token and access token, and removing the tokens from the cookies.
const logoutUser = asyncHandler(async (req, res) => {
    // 1. Verify the JWT token and retrieve the user data from the middleware.
    // 2. Update the user's refresh token in the database by setting it to undefined (effectively logging the user out).
    await User.findByIdAndUpdate(req.user, {
        $set: {
            refreshToken: undefined // Clear the refresh token in the database
        }
    }, {
        new: true // Return the updated user object after modification
    });

    // Debugging (optional)
    // console.log(req.user);

    // 3. Define cookie options to clear the tokens from cookies.
    const options = {
        httpOnly: true, // Only accessible by the server
        secure: true, // Ensures the cookie is sent over HTTPS
        sameSite: "strict" // Protects against CSRF attacks
    };

    // 4. Return a success response and clear both accessToken and refreshToken from the cookies.
    return res
        .status(200) // Success status code
        .clearCookie("accessToken", options) // Clear access token from cookies
        .clearCookie("refreshToken", options) // Clear refresh token from cookies
        .json(new ApiResponse(200, {}, "User successfully logged out.")); // Success response with a message
});

// Exporting logoutUser function for external usage.
export { logoutUser };
