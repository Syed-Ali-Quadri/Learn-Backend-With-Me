// importing libraries
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// Initialize environment variables
dotenv.config({ path: "./.env" });

// Configuration of Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

// Upload an image
const uploadOnCloudinary = async (localPathFile) => {
  try {
    if (!localPathFile) return null; // If there is no file in localPathFile then return null.

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localPathFile, {
      resource_type: "auto",
    });

    // Unlinking the file after a successful upload.
    fs.unlinkSync(localPathFile); // Delete the locally saved temporary file after successful upload
    
    // Return the response from Cloudinary (including the URL).
    return response;

  } catch (error) {
    // Check if the file exists before attempting to delete it
      fs.unlinkSync(localPathFile); // Delete the locally saved temporary file if it exists

    // Log the error for debugging purposes
    console.error("Cloudinary upload failed: ", error);
  }
};

export { uploadOnCloudinary };
