import { Router } from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { getWatchedHistory } from "../../controllers/user/getWatchedHistory.controller.js";

const routers = Router();

// Secure route.
routers.route("/watched-history").post(verifyJWT, getWatchedHistory)

export default routers;