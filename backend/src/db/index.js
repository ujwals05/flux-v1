import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const res = await mongoose.connect(`${process.env.MONGO_DB}/${DB_NAME}`);
    console.log("The database is connected to :", res.connection.name);
  } catch (error) {
    console.log("There is error while connecting to DB :", error);
    process.exit(1);
  }
};

export default connectDB;
