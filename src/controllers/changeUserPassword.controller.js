import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

// FEATURE: To change user password.

// user should input old password and new password.

// 1. Get the data from frontend.
// 2. check the validation of inputs in various ways: (oldPassword is filled or not and same with newPassword, if newPassword is same as oldPassword)
// 4. find the user.(We are using "JWTVerify middleware" so that we can access userId)
// 3. Check the oldPassword if it is correct or not
// 5. Update the password with newPassword field.

const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const getUserId = req.user;

  if (!oldPassword || !newPassword)
    throw new ApiError(401, "Please fill both fields.");

  if (oldPassword === newPassword)
    throw new ApiError(401, "New password should not be same as old password.");

  const user = await User.findById(getUserId);

    // Checking if the password is correct.
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) throw new ApiError(401, "Incorrect password.");

  console.log("Old password:", oldPassword);
  console.log("New password:", newPassword);
  console.log("Password validation result:", isPasswordValid);

  if(isPasswordValid){
  user.password = newPassword;

  await user.save();
  }

  const updatedUserPassword = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!updatedUserPassword) throw new ApiError(401, "Something went wrong.");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedUserPassword,
        "Successfully updated password."
      )
    );
});

export { changeUserPassword };
