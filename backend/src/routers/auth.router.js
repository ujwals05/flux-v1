import { Router } from "express";
import {
  register,
  login,
  logout,
  updateProfilePic,
  currentUser,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const authRouth = Router();

authRouth.route("/signup").post(register);
authRouth.route("/login").post(login);
authRouth.route("/logout").post(verifyJWT, logout);
authRouth
  .route("/updateProfilePic")
  .post(verifyJWT, upload.single("profilePic"), updateProfilePic);
authRouth.route("/currentUser").get(verifyJWT, currentUser);
export default authRouth;
