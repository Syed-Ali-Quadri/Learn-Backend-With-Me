import { Route } from "express";
import { loginUser } from "../controllers/loginUser.controller.js" 

const router = Route();

router.route("/login").post(loginUser)

export default router;