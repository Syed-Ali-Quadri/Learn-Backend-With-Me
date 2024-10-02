import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

// FEATURE: To change user password.

// This route allows users to update their password by providing both the old password and a new one.

const changeUserPassword = asyncHandler(async (req, res) => {
  // 1. Extract oldPassword and newPassword from the request body.
  const { oldPassword, newPassword } = req.body;

  // 2. Get user ID from the JWT token (the JWTVerify middleware ensures this).
  const getUserId = req.user;

  // 3. Validate if both oldPassword and newPassword are provided.
  if (!oldPassword || !newPassword)
    throw new ApiError(401, "Please fill both fields."); // Error if any field is missing.

  // 4. Ensure that the new password is different from the old password.
  if (oldPassword === newPassword)
    throw new ApiError(401, "New password should not be same as old password.");

  // 5. Find the user in the database using the user ID.
  const user = await User.findById(getUserId);

  // 6. Check if the old password entered by the user matches the stored password.
  const isPasswordValid = await user.isPasswordCorrect(oldPassword); 

  // 7. (for debugging purpose) Log the old password, user details, new password, and validation result for debugging.
  // console.log("Old password:", oldPassword);
  // console.log("user:", user);
  // console.log("New password:", newPassword);
  // console.log("Password validation result:", isPasswordValid);

  // 8. If the old password is incorrect, throw an error.
  if (!isPasswordValid) throw new ApiError(401, "Incorrect password.");

  // 9. If the old password is valid, update the user's password with the new one.
  if(isPasswordValid){
    user.password = newPassword; // Updating the password.
    await user.save(); // Save the updated user object in the database.
  }

  // 10. Retrieve the updated user object without the password and refreshToken fields.
  const updatedUserPassword = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // 11. If something went wrong and the updated user couldn't be retrieved, throw an error.
  if (!updatedUserPassword) throw new ApiError(401, "Something went wrong.");

  // 12. Return a success response with the updated user details (without sensitive info).
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedUserPassword, // Sending back the updated user (without password and refreshToken).
        "Successfully updated password." // Success message.
      )
    );
});

export { changeUserPassword };
