// Import the necessary modules.
import connectDB from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";

// Load environment variables from the .env file.
dotenv.config({
  path: "./.env",
});

// Set the port from environment variables or use 8000 as a default.
const port = process.env.PORT || 8000;

// Call the connectDB function (from the external db/index.js file).
connectDB()
  .then(() => {
    // If the connection is successful, start the Express server.
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    
    // Handle any server errors.
    app.on("error", (error) => {
      console.error("Server error: ", error);
    });
  })
  .catch((error) => {
    // If the connection fails, log the error.
    console.log("MongoDB connection failed: ", error);
  });
