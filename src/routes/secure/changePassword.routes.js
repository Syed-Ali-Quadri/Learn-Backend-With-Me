import { Router } from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { changeUserPassword } from "../../controllers/user/changeUserPassword.controller.js";

const routers = Router();

// Secure route.
routers.route("/change-password").post(verifyJWT, changeUserPassword)

export default routers;