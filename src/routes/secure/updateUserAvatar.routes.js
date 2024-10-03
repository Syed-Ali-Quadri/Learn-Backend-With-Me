import { Router } from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { updateUserAvatar } from "../../controllers/user/updateUserAvatar.controller.js";

const routers = Router();

// Secure route for uploading a single avatar image.
routers.route("/change-avatar").post(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default routers;
