// Import modules
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

// Importing dotenv module to load environment variables from a.env file.
dotenv.config({
    path: "./.env"
});

// Middleware function to verify the JWT token. This middleware function is used to check if the user is logged in before allowing them to access certain routes.  This is a middleware function that checks if the user is logged in before allowing.  This middleware function is used to verify the JWT token.  If the token is valid, it will return the payload (user data) else it will throw an error.  We are selecting the "username", "email", "_id" fields from the
const verifyJWT = asyncHandler(async (req, res, next) => {
   try {
     // In header "'Authorization': "Bearer <token>" like this may also contain so we are just on extracting the token wheather it may from cookies or header. 
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

     // Checking if the token is there or not.
     if(!token) throw new ApiError(401, "Unauthorized request.");
 
     // Verifying the token with the secret key.  If the token is valid, it will return the payload (user data) else it will throw an error.  We are selecting the "username", "email", "_id" fields from the user document.  "password" and "refreshToken" fields are excluded.  This is done to reduce the size of the token and make it more secure.  This is a middleware function that checks if the user is logged in before allowing
     const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
 
     // Finding the user from the database based on the user id from the token. We are excluding the "password" and "refreshToken" fields. This is done to reduce the size of the response. This is a middleware function that checks if the user is logged in before allowing
     const user = await User.findById(verifyToken?._id).select("-password -refreshToken");
     
     // If the user is not found, throw an error.
     if(!user) throw new ApiError(403, "Access denied.");
 
     // If everything is fine, add the user to the request object so that it can be accessed from other middleware or controllers.
     req.user = user;
 
     // If everything is fine, add the user to the request object so that it can be accessed from other middleware or controllers.
     next();
   } catch (error) {
    throw new ApiError(401, error.message || "Invalid authentication access")
   }
})

export default verifyJWT