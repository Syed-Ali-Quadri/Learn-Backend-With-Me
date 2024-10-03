import { asyncHandler } from "../../utils/asyncHandler.js"; // Utility to handle async functions and catch errors.
import { User } from "../../models/user.model.js"; // Importing the User model to interact with the database.
import { uploadOnCloudinary } from "../../utils/cloudinary.js"; // Cloudinary upload utility function.
import { ApiError } from "../../utils/ApiError.js"; // Custom error handling class.
import { ApiResponse } from "../../utils/ApiResponse.js"; // Standardized API response structure.

// FEATURE: To update the user's cover image.
const updateUserCoverImage = asyncHandler(async (req, res) => {
    // 1. Get the user ID from the JWT token (which is set by the JWTVerify middleware).
    const userId = req.user;

    // 2. Find the user in the database, excluding password and refresh token fields.
    const user = await User.findById(userId).select("-password -refreshToken");

    // 3. Check if the user exists in the database.
    if (!user) throw new ApiError(401, "User not found."); // If user not found, throw an error.

    // 4. Get the uploaded cover image path from the request. This assumes the file is uploaded via multipart/form-data.
    const updatedCoverImage = req.file?.path;

    // 5. Check if the cover image is included in the request.
    if (!updatedCoverImage) throw new ApiError(401, "Avatar not found."); // If no cover image is provided, throw an error.

    // 6. Upload the cover image to Cloudinary using the utility function.
    const uploadedCoverImage = await uploadOnCloudinary(updatedCoverImage);

    // 7. Check if the cover image was successfully uploaded to Cloudinary.
    if (!uploadedCoverImage) throw new ApiError(401, "Something went wrong while uploading"); // Error if upload fails.

    // 8. Update the user's avatar field with the uploaded cover image URL from Cloudinary.
    user.coverImage = uploadedCoverImage?.url;

    // 9. Save the updated user object in the database.
    await user.save();

    // 10. Return a success response with the updated user object (including the new cover image URL).
    return res
        .status(200) // Success status code.
        .json(new ApiResponse(200, user, "Successfully updated cover image.")); // Success response with the updated user data.
});

export { updateUserCoverImage };
