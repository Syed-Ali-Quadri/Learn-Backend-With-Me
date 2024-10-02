import { Router } from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { changeUserAvatar } from "../../controllers/user/updateUserAvatar.controller.js"
import { changeUserCoverImage } from "../../controllers/user/updateUserCoverImage.controller.js"

const routers = Router();

// Secure route.
routers.route("/change-avatar").post(verifyJWT, upload, changeUserAvatar)
routers.route("/change-coverImage").post(verifyJWT, upload, changeUserCoverImage)

export default routers;