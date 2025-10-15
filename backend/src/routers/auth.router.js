import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

const authRouth = Router();

authRouth.route("/signup").post(register);
authRouth.route("/login");
authRouth.route("/logout");

export default authRouth;
