import { Router } from "express";
import { loginUser } from "../controllers/loginUser.controller.js" 

const routers = Router();

routers.route("/login").post(loginUser)

export default routers;