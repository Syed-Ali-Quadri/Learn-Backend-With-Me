import { Router } from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { deleteTweet } from "../../controllers/tweet/deleteTweet.controller.js";

const routers = Router();

// Secure route.
routers.route("/delete-tweet/:tweetId").post(verifyJWT, deleteTweet)

export default routers;