import { Router } from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { getTweets } from "../../controllers/tweet/getTweet.controller.js";

const routers = Router();

// Secure route.
routers.route("/").get(verifyJWT, getTweets)

export default routers;