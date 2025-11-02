import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { app } from "./utils/socket.js";

dotenv.config({
  path: "./.env",
});

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());


import authRouth from "./routers/auth.router.js";
import messageRoute from "./routers/message.route.js";

app.use("/api/v1/users", authRouth);
app.use("/api/v1/message", messageRoute);

export default app;
