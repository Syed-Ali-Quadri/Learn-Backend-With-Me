import { Router } from "express";
import { refreshAccessToken } from "../controllers/refreshToken.controller.js";

const routers = Router();

// Secure route.
routers.route("/refresh-token").post(refreshAccessToken)

export default routers;