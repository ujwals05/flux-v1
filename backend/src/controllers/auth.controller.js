import { APIerror } from "../utils/apierror.js";
import { APIresponse } from "../utils/apiresponse.js";
import { User } from "../models/user.model.js";
import cloudUpload from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

const generateTokens = async (userID) => {
  const user = await User.findById(userID);
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  try {
    const { username, email, password, fullname } = req.body;

    if (!username || !email || !password) {
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
      profilePic: profileDefault.url,
    });

    const userInfo = await User.findById(user._id).select("-password");

    if (!userInfo) {
      throw new APIerror(400, "User data didnt save into database");
    }
    res
      .status(200)
      .json(new APIresponse(200, userInfo, "Register successfully"));
  } catch (error) {
    console.log("Error while register", error);

    if (error instanceof APIerror) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "INTERNAL SERVER ERROR",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email)
      throw new APIerror(400, "All field are required");

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (!user) throw new APIerror(400, "User does not exist");

    const validPassword = await user.isPasswordCorrect(password);
    if (!validPassword) throw new APIerror(400, "Incorrect password ");

    const { accessToken, refreshToken } = await generateTokens(user._id);
    console.log(accessToken);

    const userLogin = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      secure: true,
      httpOnly: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new APIresponse(200, userLogin, "Login successfully"));
  } catch (error) {
    // if (error instanceof APIerror) {
    //   return res.status(error.statusCode).json({
    //     success: false,
    //     message: error.message,
    //   });
    // }

    // res.status(500).json({
    //   success: false,
    //   message: "INTERNAL SERVER ERROR",
    // });
    throw new APIerror(401, error?.message || "Error while login");
  }
};

export const logout = async (req, res) => {
  try {
    await User.findByIdAndDelete(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secured: true,
    };

    res
      .status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options)
      .json(new APIresponse(200, {}, "User logged out successfully"));
  } catch (error) {
    console.log("Error while logout", error);
    throw new APIerror(404, "Invlaid creditials");
  }
};
