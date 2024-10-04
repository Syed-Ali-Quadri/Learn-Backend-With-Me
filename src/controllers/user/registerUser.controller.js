// Imports necessary modules
import { asyncHandler } from "../../utils/asyncHandler.js"; // Utility to handle async functions and catch errors
import { ApiError } from "../../utils/ApiError.js"; // Custom error handling class
import { ApiResponse } from "../../utils/ApiResponse.js"; // Standardized API response structure
import { User } from "../../models/user.model.js"; // Importing the User model to interact with the database
import { uploadOnCloudinary } from "../../utils/cloudinary.js"; // Cloudinary upload utility function
import fs from 'fs'; // File system module to manage files

// FEATURE: Register a new user
// This function handles user registration, including optional avatar and cover image uploads.
const registerUser = asyncHandler(async (req, res) => {
  // 1. Get user information from the request body (provided by the frontend)
  const { username, email, fullName, password } = req.body;

  // Utility function to delete temporary files (avatar or coverImage) after use
  function deleteTemporaryFile() {
    if (req?.files?.avatar?.[0]?.path) fs.unlinkSync(req?.files?.avatar?.[0]?.path); // Delete avatar if it exists
    if (req?.files?.coverImage?.[0]?.path) fs.unlinkSync(req?.files?.coverImage?.[0]?.path); // Delete coverImage if it exists
  }

  // 2. Validation: Check if any required fields are missing
  if (!username || !email || !fullName || !password) {
    deleteTemporaryFile(); // Clean up files if validation fails
    throw new ApiError(400, "All fields must be filled.");
  }

  // 3. Check if the email is valid (must contain "@")
  const atIndex = email.indexOf("@");
  if (atIndex === -1) {
    deleteTemporaryFile();
    throw new ApiError(400, "Invalid email.");
  }

  // 4. Check if the email contains a valid domain (must contain ".")
  const atIndex1 = email.indexOf(".");
  if (atIndex1 === -1) {
    deleteTemporaryFile();
    throw new ApiError(400, "Invalid email.");
  }

  // 5. Check if the username or email already exists in the database
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // If a user already exists with the provided username or email, return an error
  if (existedUser) {
    deleteTemporaryFile();
    throw new ApiError(404, "Username or email already exists.");
  }

  // 6. Optional: Check for avatar and cover image in the request (both are optional)
  const avatarLocalPath = req.files?.avatar?.[0]?.path; // Path to the avatar image (if provided)
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path; // Path to the cover image (if provided)

  // 7. Upload avatar and cover image to Cloudinary (if they exist)
  const Avatar = await uploadOnCloudinary(avatarLocalPath); // Upload avatar to Cloudinary
  const CoverImage = await uploadOnCloudinary(coverImageLocalPath); // Upload coverImage to Cloudinary

  // 8. Create a new user in the database with the provided details and Cloudinary URLs for images
  const user = await User.create({
    username: username,
    email: email.toLowerCase(), // Ensure the email is stored in lowercase
    fullName,
    password,
    avatar: Avatar?.url || "", // Use Cloudinary URL or an empty string if no avatar
    coverImage: CoverImage?.url || "", // Use Cloudinary URL or an empty string if no coverImage
  });

  // 9. Fetch the created user from the database, excluding sensitive fields like password and refreshToken
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // Do not include password and refreshToken in the response

  // 10. Check if the user was successfully created
  if (!createdUser) {
    deleteTemporaryFile(); // Clean up files if the user creation failed
    throw new ApiError(500, "Failed to create user.");
  }

  // 11. Return a success response with the newly created user (excluding sensitive information)
  return res
    .status(201) // Success status code for resource creation
    .json(new ApiResponse(201, createdUser, "User created successfully"));

  // Debugging section (optional): Logs the user details during registration
  // console.group("User Details:");
  // console.log("username: ", username);
  // console.log("email: ", email);
  // console.log("full name: ", fullName);
  // console.log("password: ", password);
  // console.log("avatar: ", avatarLocalPath);
  // console.log("cover image: ", coverImageLocalPath);
  // console.groupEnd();
});

export { registerUser };

/* 
Note: If not using asyncHandler, you'd need to wrap the function in try/catch manually:
Example:
const registerUser = async (req, res, next) => {
  try {
    // Your async logic
    res.status(200).json({
      message: "User registered successfully",
    });
  } catch (err) {
    next(err); // Manually pass the error to the next middleware
  }
};
export { registerUser }; 
*/
