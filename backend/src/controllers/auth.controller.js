import express from "express";
import { APIerror } from "../utils/apierror";
import { User } from "../models/user.model";

const register = async (req, res) => {
  try {
    const { username, email, password, fullname } = req.body;

    if (!(username || email || password)) {
      throw new APIerror(400, "Every field has to be entered");
    }

    const userExist = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (userExist) {
      throw new APIerror(400, "User already exist");
    }

    const user = await User.create({
      username: username.toLowerCase(),
      fullname,
      email,
      password,
    });

    const userInfo = await User.findById(user._id).select("-password -");
  } catch (error) {
    console.log("Error while register", error);
  }
};
