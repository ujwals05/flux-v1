import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const authRouth = Router();

authRouth.route("/signup").post(register);
authRouth.route("/login").post(login);
authRouth.route("/logout").post(verifyJWT, logout);

export default authRouth;
