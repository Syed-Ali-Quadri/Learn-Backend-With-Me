import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user.model.js";

// FEATURE: To change user details
const changeUserDetails = asyncHandler(async (req, res) => {
    // 1. Extract newEmail and newFullName from the request body.
    const { newEmail, newFullName } = req.body;

    // 2. Get userId from the JWT token (the JWTVerify middleware sets this).
    const userId = req.user;

    // 3. Find the user in the database by their ID, excluding password and refreshToken fields.
    const user = await User.findById(userId).select("-password -refreshToken");

    // 4. Check if the user exists in the database.
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    // 5. Check if at least one field (newEmail or newFullName) is provided in the request.
    if (!newFullName && !newEmail || !newEmail && !newFullName) {
        throw new ApiError(404, "At least one field must be provided.");
    }

    // 6. Check if the new details are the same as the old details.
    if (user.email === newEmail || user.fullName === newFullName) {
        throw new ApiError(401, "New details are the same as old details.");
    }

    // 7. Flag to track if any update happens.
    let isUpdated = false;

    // 8. Update the fullName if it's provided and different from the current fullName.
    if (newFullName && newFullName !== user.fullName) {
        user.fullName = newFullName;
        isUpdated = true;
    }

    // 9. Update the email if it's provided and different from the current email.
    if (newEmail && newEmail !== user.email) {
        user.email = newEmail;
        isUpdated = true;
    }

    // 10. Save the user only if there were changes made.
    if (isUpdated) {
        await user.save(); // Saving updated user data.
    } else {
        throw new ApiError(400, "No changes to update.");
    }

    // 11. Return the updated user details along with a success message.
    return res
        .status(200) // Success status code.
        .json(new ApiResponse(200, user, "User details successfully updated.")); // Success response with user data.
});

export { changeUserDetails };
