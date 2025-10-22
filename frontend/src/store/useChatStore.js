import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axios.js";

export const useChatStore = create((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      console.log("Error while getting users", error);
      toast.error(error.respose.data.messages);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ message: res.data });
    } catch (error) {
      console.log("Error while getting messages");
      toast.error(error.respose.data.message);
    }
  },
}));
