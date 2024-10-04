// Imports the necessary modules
import { asyncHandler } from "../../utils/asyncHandler.js"; // Utility to handle async functions and catch errors
import { ApiResponse } from "../../utils/ApiResponse.js"; // Standardized API response structure

// FEATURE: Get the currently authenticated user
// This function fetches the currently authenticated user's information from the request.
const currentUser = asyncHandler(async (req, res) => {
  // 1. Return a successful response with the user's information from the request
  return res
    .status(200) // Success status code
    .json(
      new ApiResponse(200, req.user, "Successfully fetched user information.") // Success response with user data
    );
});

export { currentUser };
