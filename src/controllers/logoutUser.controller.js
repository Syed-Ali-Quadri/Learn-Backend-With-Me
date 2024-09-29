import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";

// Logout user. This function is wrapped with asyncHandler to handle any potential errors.
const logoutUser = asyncHandler(async (req, res) => {
    // Verifying JWT token. Got user data from middleware.
    await User.findByIdAndUpdate(req.user, {
        // Updating refresh token option.
        $set: {     
            refreshToken: undefined
        }
    }, {
        // Now, updating refresh token and save it.
            new: true
    })

    // Clearing cookies.
    const options = {
        httpOnly: true,
        secure: true
    }

    // Returning response with success message.
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User successfully logged in."))
})

// Exporting logoutUser function.
export { logoutUser };