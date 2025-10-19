import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { APIerror } from "../utils/apierror.js";
import { APIresponse } from "../utils/apiresponse.js";
import cloudUpload from "../utils/cloudinary.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    if (!loggedInUser) {
      throw new APIerror(401, "User not logged in");
    }
    const filterUsers = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );
    if (!filterUsers) {
      throw new APIerror(400, "Error while getting users");
    }

    return res
      .status(200)
      .json(new APIresponse(200, filterUsers, "Got users from database"));
  } catch (error) {
    console.log("Error while getting users");
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

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatID } = req.params;
    const myID = req.user._id;

    const message = await Message.find({
      $or: [
        { senderID: myID, reciverID: userToChatID },
        { senderID: userToChatID, reciverID: myID },
      ],
    });

    if (!message) {
      throw new APIerror(400, "Error while getting message from database ");
    }

    return res
      .status(200)
      .json(new APIresponse(200, message, "Message fetched successfully"));
  } catch (error) {
    if (error instanceof APIerror) {
      return res.status(500).json({
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

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverID } = req.params;
    const senderID = req.user._id;

    if (!text && !req.file) {
      throw new APIerror(400, "No message or image to send");
    }

    // Upload image if provided
    let uploadImage = null;
    const imageLocalPath = req.file?.path;
    if (imageLocalPath) {
      uploadImage = await cloudUpload(imageLocalPath);
    }

    // Create and save message
    const newMessage = await Message.create({
      senderID,
      receiverID,
      text: text || "",
      image: uploadImage?.url || "",
    });

    // Optionally: populate sender or receiver if you need it on the frontend
    // const populatedMessage = await newMessage.populate("senderID receiverID", "username profilePic");

    return res
      .status(200)
      .json(new APIresponse(200, newMessage, "Message sent successfully"));
  } catch (error) {
    console.error("Error while sending message:", error);

    if (error instanceof APIerror) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error?.message || "Error while sending message",
    });
  }
};