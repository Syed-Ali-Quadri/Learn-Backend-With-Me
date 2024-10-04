// Import necessary modules
import mongoose from "mongoose"; // Mongoose ODM for MongoDB
import { DB_NAME } from "../constants.js"; // Import database name from constants
import dotenv from "dotenv"; // Module for loading environment variables

// Load environment variables from .env file
dotenv.config({
  path: "./.env"
});

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using Mongoose
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}` // Connection URI
    );
    // Log a success message along with the host of the connected database
    console.log("\n MongoDB Connected!!", connectionInstance.connection.host);
  } catch (error) {
    // Log an error message if the connection fails
    console.log("The database connection is broken: ", error);
    // Exit the process with a failure status code
    process.exit(1);
  }
};

// Export the connectDB function for use in other modules
export default connectDB;
