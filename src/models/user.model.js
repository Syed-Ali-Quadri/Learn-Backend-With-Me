import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      lowercase: [true, "Username must be lowercase"],
      trim: true,
      minlength: [5, "Username must be at least 5 characters long"],
      maxlength: [20, "Username must be at most 20 characters long"],
      index: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: [true, "email must be lowercase"],
      trim: true,
    },
    fullName: {
      type: String,
      require: true,
      index: true,
    },
    avatar: {
      type: String, // cloudnary url
      default: "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
    },
    coverImage: {
      type: String, // cloudnary url
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    refreshToken: {
      type: String,
    },
    watchHistory: {
      type: [Schema.Types.ObjectId],
      ref: "Video",
    },
  },
  { timestamps: true }
);

// Using Middleware: Making password crypted
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // If anything is changed or updated except the password then do nothing...
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Using Custom Method: Checking password is correct or not.
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating JWT Access token for password
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Generating JWT Refresh token for password
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
