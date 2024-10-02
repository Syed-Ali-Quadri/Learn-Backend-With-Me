import { Router } from "express";
import { refreshAccessToken } from "../controllers/user/refreshToken.controller.js";

const routers = Router();

// Secure route.
routers.route("/refresh-token").post(refreshAccessToken)

export default routers;