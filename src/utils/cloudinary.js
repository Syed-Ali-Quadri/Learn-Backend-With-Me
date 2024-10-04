// Importing necessary libraries
import { v2 as cloudinary } from "cloudinary"; // Cloudinary library for image uploads
import fs from "fs"; // File system module for file handling
import dotenv from "dotenv"; // Module to load environment variables
import { ApiError } from "./ApiError.js"; // Custom error handling class

// Initialize environment variables from .env file
dotenv.config({ path: "./.env" });

// Configuration of Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY, // Cloudinary API key
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET, // Cloudinary API secret
});

// Function to upload an image to Cloudinary
const uploadOnCloudinary = async (localPathFile) => {
  try {
    if (!localPathFile) return null; // If there is no file path, return null.

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localPathFile, {
      resource_type: "auto", // Automatically detect the resource type
    });

    // Unlink (delete) the file after a successful upload
    fs.unlinkSync(localPathFile); // Remove the locally saved temporary file

    // Return the response from Cloudinary, including the URL
    return response;

  } catch (error) {
    // Log the error for debugging purposes
    throw new ApiError(401, "Cloudinary upload failed: " + error);
  }
};

// Utility function to delete an image from Cloudinary using its URL
const deleteImageOnCloudinary = async (url) => {
  try {
      if (!url) return null; // If there is no URL, return null.

      // Extract the public ID from the URL
      const parts = url.split('/upload/'); // Split the URL at '/upload/'
      const publicIdWithVersion = parts[1]; // Get the part after '/upload/'
      const publicId = publicIdWithVersion.split('/')[1]?.split('.')[0]; // Extract the public ID without version and extension

      // Debugging information to ensure the extraction works
      // console.log("Splitting image url", parts);
      // console.log("Getting the part after /upload/", publicIdWithVersion);
      // console.log("The main public Url/id", publicId);

      // Check if publicId was successfully extracted
      if (!publicId) throw new ApiError('Invalid public ID extraction from URL');

      // Delete the image from Cloudinary using the public ID
      const result = await cloudinary.uploader.destroy(publicId); // Perform the delete operation
      // console.log("Delete result from Cloudinary:", result); // Log the result for debugging
  } catch (error) {
      // Throw a custom error if the delete operation fails
      throw new ApiError(401, `Cloudinary delete failed: ${error.message}`);
  }
};

// Export the upload and delete functions for use in other modules
export { uploadOnCloudinary, deleteImageOnCloudinary };
