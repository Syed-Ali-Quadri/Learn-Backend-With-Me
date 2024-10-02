import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

// FEATURE: To change user details
const changeUserDetails = asyncHandler(async (req, res) => {
    const { newEmail, newFullName } = req.body;
    const userId = req.user;

    // Find the user, excluding password and refresh token fields
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    // Check if new details are the same as old details
    if (user.email === newEmail || user.fullName === newFullName) {
        throw new ApiError(401, "New details are the same as old details.");
    }

    // Update the user details
    let isUpdated = false;
    if (newFullName && newFullName !== user.fullName) {
        user.fullName = newFullName;
        isUpdated = true;
    }

    if (newEmail && newEmail !== user.email) {
        user.email = newEmail;
        isUpdated = true;
    }

    if (isUpdated) {
        await user.save();
    } else {
        throw new ApiError(400, "No changes to update.");
    }

    // Returning the updated user details and success message
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User details successfully updated."));
});

export { changeUserDetails };
