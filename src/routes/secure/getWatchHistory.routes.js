import { Router } from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { getUserWatchedHistory } from "../../controllers/user/getWatchedHistory.controller.js";

const routers = Router();

// Secure route.
routers.route("/watch-history").post(verifyJWT, getUserWatchedHistory)

export default routers;