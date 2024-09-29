import { Route } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { logoutUser } from "../controllers/logoutUser.controller.js";

const router = Route();

// Secure route.
router.route("/logout").post(verifyJWT, logoutUser)

export default router;