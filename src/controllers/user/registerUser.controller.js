// Imports the modules.
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import fs from 'fs'; // Import fs

// Register new user. This function is wrapped with asyncHandler to handle any potential errors.
const registerUser = asyncHandler(async (req, res) => {
  // Getting user information from frontend.
  const { username, email, fullName, password } = req.body;

  // Validation if there is empty fields.
  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All the fields must be required.");
  }

  // No "@" found, email is invalid
  const atIndex = email.indexOf("@");
  
  if (atIndex === -1) {
    throw new ApiError(400, "Invalid email.")
  }
  // Checking if the user email is valid.
  const atIndex1 = email.indexOf(".");

  if (atIndex1 === -1) {
    throw new ApiError(400, "Invalid email.")
  }

  // Check if the email, username is already used.
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(404, "Username or email already existed.");
  }

  // Check in the images (avatar and imageCover), and both images are optional.
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // Upload the image to the cloudinary.
  const Avatar = await uploadOnCloudinary(avatarLocalPath); // Upload the avatar image to the cloudinary.
  const CoverImage = await uploadOnCloudinary(coverImageLocalPath); // Upload the coverImage to the cloudinary.

  // Create a new user in the database.
  const user = await User.create({
    username: username,
    email: email.toLowerCase(),
    fullName,
    password,
    avatar: Avatar?.url || "",
    coverImage: CoverImage?.url || "",
  });

  // Checking if the user is created successfully.
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // Removing the password and refreshToken.

  // If the user is not created throw an error.
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user.");
  }

  // Returning the response.
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "created user successfully"));

  //   console.group("User Details:");
  //   console.log("username: ", username);
  //   console.log("email: ", email);
  //   console.log("full name: ", fullName);
  //   console.log("password: ", password);
  //   console.log("avatar: ", avatarLocalPath);
  //   console.log("cover image: ", coverImageLocalPath);
  //   console.groupEnd();
});

export { registerUser };

// If I want to write code without "asyncHandler" then in every file I have to write try....catch again and again....

/* const registerUser = async (req, res, next) => {
    try {
      // Your async logic
      res.status(200).json({
        message: "User registered successfully",
      });
    } catch (err) {
      next(err); // Manually pass the error to the next middleware
    }
  };
  
  export { registerUser }; */
