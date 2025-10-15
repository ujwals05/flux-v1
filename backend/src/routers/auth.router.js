import { Router } from "express";

const authRouth = Router();

authRouth.route.post("/signup");
authRouth.route("/login");
authRouth.route("/logout");

export default authRouth;
