import { Router } from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { createTweet } from "../../controllers/tweet/createTweet.controller.js";

const routers = Router();

// Secure route.
routers.route("/create-tweet").post(verifyJWT, createTweet)

export default routers;