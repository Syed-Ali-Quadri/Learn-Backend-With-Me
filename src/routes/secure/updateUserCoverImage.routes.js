import { Router } from "express";
import verifyJWT from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { updateUserCoverImage } from "../../controllers/user/updateUserCoverImage.controller.js";

const routers = Router();

// Secure route for uploading a single cover image.
routers.route("/change-coverImage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

export default routers;
