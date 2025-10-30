import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { app } from "./utils/socket.js";
import path from "path";

dotenv.config({
  path: "./.env",
});

const __dirname = path.resolve();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

import authRouth from "./routers/auth.router.js";
import messageRoute from "./routers/message.route.js";

app.use("/api/v1/users", authRouth);
app.use("/api/v1/message", messageRoute);

if (process.env.NODE_ENV === "production") {
  // Serve React build files
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Catch-all route for React Router
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

export default app;
