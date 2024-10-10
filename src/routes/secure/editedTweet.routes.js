import { Router } from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { updateTweet } from "../../controllers/tweet/updateTweet.controller.js";

const routers = Router();

// Secure route.
routers.route("/update-tweet/:tweetId").patch(verifyJWT, updateTweet)

export default routers;