import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

// Initialize environment variables
dotenv.config({ path: "./.env" });

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

// Upload an image
const uploadOnCloudinary = async (localPathFile) => {
  try {
    if (!localPathFile) return null; // If there is no file in the localPathFile then return null.

    // If there is file in localPathFile then, upload the file to Cloudinary using Cloudinary's "uploader.upload" method.
    const response = await cloudinary.uploader.upload(localPathFile, {
      resource_type: "auto",
    });

    // Return the URL of the uploaded file.
    return response;

    // Log the URL of the uploaded file.
    console.log("Your file has been uploaded successfully ", response.url);
  } catch (error) {
    fs.unlinkSync(localPathFile); // Delete the locally saved temporary file as the upload operation failed.
    console.log(error);
  }
};

export { uploadOnCloudinary };
