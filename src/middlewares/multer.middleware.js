// Import the multer package.
import multer from "multer";

// Set up the storage configuration using disk storage.
const storage = multer.diskStorage({
  // Define the destination where uploaded files will be stored temporarily.
  destination: function (req, file, cb) {
    // Alloting temp file path under './public/temp/' folder.
    cb(null, "./public/temp/");
  },
  
  // Set the filename for the uploaded file, ensuring it's unique.
  filename: function (req, file, cb) {
    // Generating a unique suffix based on the current timestamp and a random number.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    // Create the filename by concatenating the original field name with the unique suffix.
    cb(null, file.fieldname + '-' + uniqueSuffix); // Filename with unique suffix.
  }
});

// Create an upload instance using the storage configuration.
export const upload = multer({ storage: storage });
