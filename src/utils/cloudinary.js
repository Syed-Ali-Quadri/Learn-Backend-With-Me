// importing stuffs/liberaries
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

// Initialize environment variables
dotenv.config({ path: "./.env" });

// Configuration of cloudinary
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

    // Log the URL of the uploaded file.
    console.log("Your file has been uploaded successfully: ", response.url);

    // Return the URL of the uploaded file.
    return response;

  } catch (error) {
    fs.unlinkSync(localPathFile); // Delete the locally saved temporary file as the upload operation failed.
    console.log(error);
  }
};

uploadOnCloudinary("https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp")

export { uploadOnCloudinary };
