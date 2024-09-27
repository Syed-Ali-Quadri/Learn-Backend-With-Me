// Imports the modules.
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

// Login user function
const loginUser = asyncHandler(async (req, res) => {
    // Extracting the required data from the frontend request.
    const { email, password } = req.body;

    // Checking that inputs are valid.
    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Please fill all the input.");
    }

    // Checking if the user email is valid.
    const indexOfAt = email.indexOf("@");
    const indexOfDot = email.lastIndexOf(".");

    if (indexOfAt === -1 || indexOfDot === -1 || indexOfAt > indexOfDot || indexOfAt === 0 || indexOfDot === email.length - 1 || indexOfDot - indexOfAt < 2) {
        throw new ApiError(400, "Invalid email address.");
    }

    // Comparing the email and password.
    const isMatch = await User.findOne({ email, password });

    if (!isMatch) throw new ApiError(400, "User not found.");
    console.log("Success");

    return res.status(200).json(new ApiResponse(200, isMatch , "User successfully logged in."));
});

// Exporting the loginUser function
export { loginUser };



/*
const loginUser = async (req, res, next) => {
    try {
        // Your async logic...
    } catch (err) {
        next(err); // Manually pass the error to the next middleware
    }
};
*/
