import { Router } from "express";
import { registerUser } from "../controllers/registerUser.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import loginLimit from "../middlewares/limitRate.middleware.js";

const routers = Router();

routers.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]), loginLimit,
  registerUser
);

export default routers;
