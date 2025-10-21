import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  getUserForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const messageRoute = Router();

messageRoute.route("/users").get(verifyJWT, getUserForSidebar);
messageRoute.route("/:id").get(verifyJWT, getMessages);
messageRoute
  .route("/send/:id")
  .post(verifyJWT, upload.single("image"), sendMessage);

export default messageRoute;
