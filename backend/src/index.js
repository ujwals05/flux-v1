import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT, () => {
      console.log("The server is running on ", process.env.PORT);
    });
    server.on("error", (err) => {
      console.log("Error in the server:", err);
    });
  })
  .catch((error) => {
    console.log("Error in the server side:", error);
  });
