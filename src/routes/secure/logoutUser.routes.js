import { Router } from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { logoutUser } from "../../controllers/user/logoutUser.controller.js";

const routers = Router();

// Secure route.
routers.route("/logout").post(verifyJWT, logoutUser)

export default routers;