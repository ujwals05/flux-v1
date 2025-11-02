import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      // console.log(res.data.message)
      set({ users: res.data.message });
    } catch (error) {
      // console.log("Error while getting users", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data.message });
    } catch (error) {
      // console.log("Error while getting messages");
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const formData = new FormData();

      if (messageData.text) formData.append("text", messageData.text);
      if (messageData.image) formData.append("image", messageData.image);

      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set({ messages: [...messages, res.data.message] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },

  SubscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unSubscribeToMessage:()=>{
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage")
  },

  //todo : Optimise this later
  setSelectedUser: async (selectedUser) => {
    set({ selectedUser });
  },
}));
