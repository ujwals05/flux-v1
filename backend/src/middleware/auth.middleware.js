import { APIerror } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.body.accessToken;
    if (!token) {
      throw new APIerror(400, "No access token exist");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodeToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new APIerror(404, "Invalid creditials");
    }

    req.user = user;
    next();
  } catch (error) {
    // console.log("Error while login", error);
    // throw new APIerror(401, error?.message || "No proper authorization");
    if (error instanceof APIerror) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(401).json({
      success: false,
      message: "No creditenials",
    });
  }
};

export { verifyJWT };
