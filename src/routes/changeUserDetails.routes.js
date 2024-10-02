import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { changeUserDetails } from "../controllers/changeUserDetails.js";

const routers = Router();

// Secure route.
routers.route("/change-details").post(verifyJWT, changeUserDetails)

export default routers;