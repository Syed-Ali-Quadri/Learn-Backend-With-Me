// Imports the modules.
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

// Generating the access token and refresh token.
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken; // This method is already created in the mongodb model file.
    const refreshToken = await user.generateRefreshToken(); // This method is already created in the mongodb model file.

    user.refreshToken = refreshToken; // In mongodb model there is an object which we did not save in it, that object key is for this step.
    await user.save({ validateBeforeSave: false }); // At the time of saving files it requires validation before saving, simply we are not validating.

    return { accessToken, refreshToken }; // returning access and refresh token.
  } catch (error) {
    throw new ApiError(500, "Error generating access token or refresh token.");
  }
};

// Login user function
const loginUser = asyncHandler(async (req, res) => {
  // Extracting the required data from the frontend request.
  const { username, email, password } = req.body;

  // Checking that inputs are valid.
  if (!username || !email || !password) {
    throw new ApiError(400, "Username or email and password is required.");
  }

  // Checking if the user email is valid.
  const indexOfAt = email.indexOf("@");
  const indexOfDot = email.lastIndexOf(".");

  if (
    indexOfAt === -1 ||
    indexOfDot === -1 ||
    indexOfAt > indexOfDot ||
    indexOfAt === 0 ||
    indexOfDot === email.length - 1 ||
    indexOfDot - indexOfAt < 2
  ) {
    throw new ApiError(400, "Invalid email address.");
  }

  // Checking whether username or email is exist or not.
  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) throw new ApiError(400, "User not found.");

  // Checking if the password is correct.
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "Incorrect password.");

  // Access token and refresh token generation.
  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);


  // Checking if the user is loggedIn successfully.
  const loggedIn = await User.findOne( User._id ).select("-password -refreshToken");

  // Send a refresh token and access tokens in the cookies section and returning the loginUser data.
  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .cookie("refreshToken", refreshToken, options) // saving the refresh token in cookies section.
  .cookie("accessToken", accessToken, options) // saving the access token in cookies section.
  .json(new ApiResponse(200, {
    user: loggedIn, accessToken, refreshToken
  }, "User successfully logged in.")); // returning the loginUser data.
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
