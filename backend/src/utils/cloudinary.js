import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const cloudUpload = async (localpath) => {
  try {
    if (!localpath) return null;
    const result = await cloudinary.uploader.upload(localpath);
    // console.log(result);
    fs.unlinkSync(localpath);
    return result;
  } catch (error) {
    console.log("Error while uploading photo", error);
    fs.unlinkSync(localpath);
  }
};

export default cloudUpload;
