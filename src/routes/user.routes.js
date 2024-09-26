import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const routers = Router();

routers.route("/register").post(registerUser)

export default routers;