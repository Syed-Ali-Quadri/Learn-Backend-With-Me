import { Router } from "express";
import { loginUser } from "../controllers/loginUser.controller.js" 
import loginLimit from "../middlewares/limitRate.middleware.js";

const routers = Router();

routers.route("/login").post(loginLimit ,loginUser)

export default routers;