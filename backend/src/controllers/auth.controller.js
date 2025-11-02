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
        throw new APIerror(400, "User already exists");
      }

      const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        profilePic: null,
      });

      const userInfo = await User.findById(user._id).select("-password");

      if (!userInfo) {
        throw new APIerror(400, "User data didn't save into database");
      }

      res
        .status(200)
        .json(new APIresponse(200, "Register successfully", userInfo));
    } catch (error) {
      if (error instanceof APIerror) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };


  export const login = async (req, res) => {
    try {
      const { username, password, email } = req.body;
      if (!username || !password || !email)
        throw new APIerror(400, "All fields are required");

      const user = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (!user) throw new APIerror(400, "User does not exist");

      const validPassword = await user.isPasswordCorrect(password);
      if (!validPassword) throw new APIerror(400, "Incorrect password");

      const { accessToken, refreshToken } = await generateTokens(user._id);

      const userLogin = await User.findById(user._id).select(
        "-password -refreshToken"
      );

      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      };

      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new APIresponse(200, "Login successfully", userLogin));
    } catch (error) {
      console.error(error);
      if (error instanceof APIerror) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };


  export const logout = async (req, res) => {
    try {
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: { refreshToken: undefined },
        },
        { new: true }
      );

      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      };

      res
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .status(200)
        .json(new APIresponse(200, "User logged out successfully", {}));
    } catch (error) {
      if (error instanceof APIerror) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Error while logout",
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

      if (incomingToken !== user.refreshToken) {
        throw new APIerror(400, "Refresh token didn't match");
      }

      const { accessToken, refreshToken } = await generateTokens(user._id);
      const userInfo = await User.findById(user._id).select(
        "-password -refreshToken"
      );

      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      };

      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new APIresponse(200, "Token refreshed successfully", userInfo));
    } catch (error) {
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
      if (!req.file) {
        throw new APIerror(400, "No file uploaded");
      }

      // req.file.buffer from multer.memoryStorage()
      const uploadResult = await cloudUpload(req.file.buffer, "profile_pics");

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { profilePic: uploadResult.secure_url } },
        { new: true }
      ).select("-password -refreshToken");

      return res
        .status(200)
        .json(new APIresponse(200, "Profile pic updated successfully", user));
    } catch (error) {
      console.error("Error while updating profile:", error);
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
        throw new APIerror(400, "All fields are required");
      }

      const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { fullname } },
        { new: true }
      ).select("-password");

      return res
        .status(200)
        .json(new APIresponse(200, "User updated successfully", user));
    } catch (error) {
      console.error("Error while updating profile:", error);
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
        .json(new APIresponse(200, "Current user displayed", req.user));
    } catch (error) {
      console.error("No user exist:", error);
    }
  };


  export const deleteUser = async (req, res) => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        throw new APIerror(400, "Current user doesn't exist");
      }

      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        throw new APIerror(400, "Cannot delete the user");
      }

      return res
        .status(200)
        .json(new APIresponse(200, "Successfully deleted user", {}));
    } catch (error) {
      console.error("Error while deleting user:", error);
      if (error instanceof APIerror) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
