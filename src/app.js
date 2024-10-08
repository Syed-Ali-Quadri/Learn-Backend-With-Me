// Import necessary modules
import express from "express"; // Web framework for Node.js
import cors from "cors"; // Middleware to enable Cross-Origin Resource Sharing (CORS)
import cookieParser from "cookie-parser"; // Middleware for parsing cookies
import dotenv from "dotenv"; // Module for loading environment variables from a .env file
import { CONFIG_EXPRESS_LIMIT } from "./constants.js"; // Import configuration constants for request limits

// Initialize an Express app instance
const app = express();

// Load environment variables from the .env file
dotenv.config({
  path: "./.env", // Path to the .env file
});

// Configure CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from the specified origin (domain)
    credentials: true, // Allow credentials such as cookies and authentication headers
  })
);

// Middleware to parse incoming JSON request bodies with a size limit
app.use(express.json({ limit: CONFIG_EXPRESS_LIMIT }));

// Middleware to parse URL-encoded request bodies with a size limit
app.use(express.urlencoded({ extended: true, limit: CONFIG_EXPRESS_LIMIT }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse cookies attached to incoming requests
app.use(cookieParser());

// Import user-related route handlers
import registerUser from "./routes/registerUser.routes.js"; // Route for user registration
import loginUser from "./routes/loginUser.routes.js"; // Route for user login
import logoutUser from "./routes/secure/logoutUser.routes.js"; // Route for user logout
import refreshAccess from "./routes/secure/refreshAccessToken.routes.js"; // Route for refreshing access tokens
import changePassword from "./routes/secure/changePassword.routes.js"; // Route for changing the user's password
import changeUserDetails from "./routes/secure/changeUserDetails.routes.js"; // Route for updating user details
import updateUserAvatar from "./routes/secure/updateUserAvatar.routes.js"; // Route for updating the user's avatar
import updateUserCoverImage from "./routes/secure/updateUserCoverImage.routes.js"; // Route for updating the user's cover image
import userProfile from "./routes/secure/userChannelProfile.routes.js"; // Route for retrieving the user's profile
import getHistory from "./routes/secure/getWatchHistory.routes.js"; // Route for retrieving the user's Watch History

// Use the imported routes to handle specific user-related operations
app.use("/api/v1/users", registerUser); // User registration routes
app.use("/api/v1/users", loginUser); // User login routes
app.use("/api/v1/users", logoutUser); // User logout routes
app.use("/api/v1/users", refreshAccess); // Route to refresh access tokens
app.use("/api/v1/users", changePassword); // Route for changing user password
app.use("/api/v1/users", changeUserDetails); // Route to update user details
app.use("/api/v1/users", updateUserAvatar); // Route for updating user avatar
app.use("/api/v1/users", updateUserCoverImage); // Route for updating user cover image
app.use("/api/v1/users", userProfile); // Route to retrieve user profile
app.use("/api/v1/users", getHistory); // Route to retrieve user Watched History

// Export the Express app instance for use in other modules (like server or test files)
export { app };
