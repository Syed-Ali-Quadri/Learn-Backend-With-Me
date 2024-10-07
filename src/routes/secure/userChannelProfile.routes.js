// Import necessary modules
import { Router } from "express"; // Importing Express Router to define routes
import verifyJWT from "../../middlewares/auth.middleware.js"; // Importing middleware to verify JWT (authentication)
import { getUserChannelProfile } from "../../controllers/user/getUserChannelProfile.controller.js"; // Importing the controller that handles getting user channel profile

// Create an instance of the Router
const routers = Router();

// Define a route for getting the user channel profile
// This route listens for POST requests at the URL "/channels/:username"
// The 'verifyJWT' middleware is applied first to check if the user is authenticated
// If authenticated, the 'getUserChannelProfile' controller handles the request
routers.route("/channels/:username").post(verifyJWT, getUserChannelProfile);

// Export the routers so they can be used in other modules
export default routers;
