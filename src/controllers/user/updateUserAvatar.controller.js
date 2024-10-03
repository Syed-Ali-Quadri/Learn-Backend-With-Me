import { asyncHandler } from "../../utils/asyncHandler.js"; // Handles async functions to catch errors.
import { User } from "../../models/user.model.js"; // User model to interact with the database.
import { uploadOnCloudinary } from "../../utils/cloudinary.js"; // Utility function to upload images to Cloudinary.
import { ApiError } from "../../utils/ApiError.js"; // Custom error handling class.
import { ApiResponse } from "../../utils/ApiResponse.js"; // Standardized API response format.

// FEATURE: To update the user's avatar.
const updateUserAvatar = asyncHandler(async (req, res) => {
    // 1. Extract userId from the JWT token (set by JWTVerify middleware).
    const userId = req.user;

    // 2. Find the user in the database using the userId, excluding password and refresh token fields.
    const user = await User.findById(userId).select("-password -refreshToken");

    // 3. Check if the user exists in the database.
    if (!user) throw new ApiError(401, "User not found."); // If user not found, return an error.

    // 4. Extract the uploaded avatar from the request (assuming the file is uploaded via multipart/form-data).
    const updatedAvatar = req.file?.path;

    // 5. Check if the avatar file exists in the request.
    if (!updatedAvatar) throw new ApiError(401, "Avatar not found."); // If no avatar is provided, throw an error.

    // 6. Upload the avatar image to Cloudinary using the utility function.
    const uploadedAvatar = await uploadOnCloudinary(updatedAvatar);

    // 7. Check if the avatar was successfully uploaded to Cloudinary.
    if (!uploadedAvatar) throw new ApiError(401, "Something went wrong while uploading"); // Error if the upload fails.

    // 8. Update the user's avatar URL with the uploaded image's URL from Cloudinary.
    user.avatar = uploadedAvatar?.url;

    // 9. Save the updated user object to the database.
    await user.save();

    // 10. Return a success response with the updated user object (including the new avatar URL).
    return res
        .status(200) // Status code for success.
        .json(new ApiResponse(200, user, "Successfully updated avatar")); // Success response with user data.
});

export { updateUserAvatar };
