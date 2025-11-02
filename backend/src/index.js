import app from "./app.js";
import connectDB from "./db/index.js";
import { server } from "./utils/socket.js";



connectDB()
  .then(() => {
    const serverOn = server.listen(process.env.PORT, () => {
      console.log("The server is running on ", process.env.PORT);
    });
    serverOn.on("error", (err) => {
      console.log("Error in the server:", err);
    });
  })
  .catch((error) => {
    console.log("Error in the server side:", error);
  });
 