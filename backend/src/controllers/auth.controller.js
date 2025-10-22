import { APIerror } from "../utils/apierror.js";
import { APIresponse } from "../utils/apiresponse.js";
import { User } from "../models/user.model.js";
import cloudUpload from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

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
    // const photo = await profileFunction();
    const user = await User.create({
      username: username.toLowerCase(),
      fullname,
      email,
      password,
      profilePic: "",
    });

    const userInfo = await User.findById(user._id).select("-password");

    if (!userInfo) {
      throw new APIerror(400, "User data didnt save into database");
    }
    res
      .status(200)
      .json(new APIresponse(200, userInfo, "Register successfully"));
  } catch (error) {
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
    console.log(error);
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
    // throw new APIerror(401, error?.message || "Error while login");
  }
};

export const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
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
    // throw new APIerror(404, "Invlaid creditials");
    if (error instanceof APIerror) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Erro while logout",
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingToken) {
      throw new APIerror(400, "Unauthorized request");
    }

    const decodeToken = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodeToken?._id);
    if (!user) {
      throw new APIerror(400, "Invalid refresh token");
    }
    if (incomingToken != user.refreshToken) {
      throw new APIerror(400, "Refresh token didnt match");
    }

    const options = {
      httpOnly: true,
      secured: true,
    };

    const { accessToken, refreshToken } = generateTokens(user._id);
    const userInfo = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new APIresponse(200, userInfo, "Token refreshed successfully"));
  } catch (error) {
    // console.log("Error while refreshing access token :", error);
    if (error instanceof APIerror) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error while refreshing token",
    });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const profilePath = req.file?.path;
    if (!profilePath) {
      throw new APIerror(400, "No path exist");
    }

    const uploading = await cloudUpload(profilePath);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          profilePic: uploading.url,
        },
      },
      {
        new: true,
      }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json(new APIresponse(200, user, "Profile pic updated "));
  } catch (error) {
    console.log("Error while updating profile", error);
    // throw new APIerror(400, error?.message || "Error while updating profile");
    if (error instanceof APIerror) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error while updating profile pic",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname } = req.body;
    if (!fullname) {
      throw new APIerror(400, "ALl the field are required");
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          fullname: fullname,
        },
      },
      { new: true }
    ).select("-password");
    return res
      .status(200)
      .json(new APIresponse(200, user, "User updated successfully"));
  } catch (error) {
    console.log("Error while updating profile", error);
    if (error instanceof APIerror) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error while updating profile",
    });
  }
};

export const currentUser = async (req, res) => {
  try {
    return res
      .status(200)
      .json(new APIresponse(200, req.user, "Current user displayed"));
  } catch (error) {
    console.log("No user exist", error);
  }
};
