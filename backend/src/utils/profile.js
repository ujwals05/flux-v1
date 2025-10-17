import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always resolve .env relative to the backend root (2 levels up from /src/utils)
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const imagePath = path.join(__dirname, "profilepic.jpg"); // ensures correct location

const profileFunction = async () => {
  try {
    const profileDefault = await cloudinary.uploader.upload(imagePath);
    console.log("Uploaded successfully");
    // console.log(profileDefault);
    return profileDefault
  } catch (error) {
    console.log("Error while uploading", error);
  }
};
export default profileFunction;
