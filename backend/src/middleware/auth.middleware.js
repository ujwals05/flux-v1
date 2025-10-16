import { APIerror } from "../utils/apierror";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
const verifyJWT = async (req, res) => {
  try {
    const token =
      req.cookie.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
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
    console.log("Error while login", error);
    throw new APIerror(401, error?.message || "No proper authorization");
  }
};
