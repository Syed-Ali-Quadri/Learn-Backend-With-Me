import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // Getting user information from frontend.
  const { username, email, fullName, password } = req.body;

  // Validation if there is empty fields.
  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All the fields must be required.");
  }

  const atIndex = email.indexOf("@");
  if (atIndex === -1) {
    // No "@" found, email is invalid
    console.log('Invalid email: No "@" found.');
    return false;
  }

  // Check if the email, username is already used.
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "Username or email already existed.");
  }

  // Check in the images (avatar and imageCover), and both images are optional.
  const avatarLocalPath = await req.files?.avatar;
  const coverImageLocalPath = await req.files?.coverImage;

  // Upload the image to the cloudinary.
  const avatar = await uploadOnCloudinary(avatarLocalPath); // Upload the avatar image to the cloudinary.
  const coverImage = await uploadOnCloudinary(coverImageLocalPath); // Upload the coverImage to the cloudinary.

  // If there is any error while uploading, return null.
  if (!avatar) return null;
  if (!coverImage) return null;

  // Create a new user in the database.
  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    fullName,
    password,
    avatar: avatar?.url || "",
    coverImage: coverImage?.url || "",
  });

  // Checking if the user is created successfully.
  const createdUser = await User.findById(User._id).select(
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
