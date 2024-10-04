// Import necessary modules
import express from "express"; // Web framework for Node.js
import cors from "cors"; // Middleware for enabling CORS
import cookieParser from "cookie-parser"; // Middleware for parsing cookies
import dotenv from "dotenv"; // Module for loading environment variables
import { CONFIG_EXPRESS_LIMIT } from "./constants.js"; // Configuration constants

// Initialize Express app
const app = express();

// Load environment variables from .env file
dotenv.config({
  path: "./.env",
});

// Configure CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from specified origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// Middleware for parsing JSON request bodies with a specified limit
app.use(express.json({ limit: CONFIG_EXPRESS_LIMIT }));

// Middleware for parsing URL-encoded request bodies with a specified limit
app.use(express.urlencoded({ extended: true, limit: CONFIG_EXPRESS_LIMIT }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware for parsing cookies
app.use(cookieParser());

// Import routes for user-related functionalities
import registerUser from "./routes/registerUser.routes.js"; // User registration routes
import loginUser from "./routes/loginUser.routes.js"; // User login routes
import logoutUser from "./routes/secure/logoutUser.routes.js"; // User logout routes
import refreshAccess from "./routes/secure/refreshAccessToken.routes.js"; // Refresh access token routes
import changePassword from "./routes/secure/changePassword.routes.js"; // Change user password routes
import changeUserDetails from "./routes/secure/changeUserDetails.routes.js"; // Update user details routes
import updateUserAvatar from "./routes/secure/updateUserAvatar.routes.js"; // Update user avatar routes
import updateUserCoverImage from "./routes/secure/updateUserCoverImage.routes.js"; // Update user cover image routes

// Declare routers for handling user-related routes
app.use("/api/v1/users", registerUser); // Route for user registration
app.use("/api/v1/users", loginUser); // Route for user login
app.use("/api/v1/users", logoutUser); // Route for user logout
app.use("/api/v1/users", refreshAccess); // Route for refreshing access token
app.use("/api/v1/users", changePassword); // Route for changing password
app.use("/api/v1/users", changeUserDetails); // Route for changing user details
app.use("/api/v1/users", updateUserAvatar); // Route for updating user avatar
app.use("/api/v1/users", updateUserCoverImage); // Route for updating user cover image

// Export the Express app instance for use in other modules
export { app };
