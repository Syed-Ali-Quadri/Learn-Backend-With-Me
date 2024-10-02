import { Router } from "express";
import { refreshAccessToken } from "../../controllers/user/refreshToken.controller.js";
import verifyJWT from "../../middlewares/auth.middleware.js";

const routers = Router();

// Secure route.
routers.route("/refresh-token").post(verifyJWT ,refreshAccessToken)

export default routers;