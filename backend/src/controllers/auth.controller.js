import { APIerror } from "../utils/apierror.js";
import { APIresponse } from "../utils/apiresponse.js";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
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

    const userInfo = await User.findById(user._id).select("-password");

    if (!userInfo) {
      throw new APIerror(400, "User data didnt save into database");
    }
    res
      .status(200)
      .json(new APIresponse(200, userInfo, "Register successfully"));
  } catch (error) {
    console.log("Error while register", error);
    res.json(error);
  }
};
