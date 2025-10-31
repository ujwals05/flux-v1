import { create } from "zustand";
import { axiosInstance } from "../utils/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.META === "development" ? "http://localhost:8001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isUpdatingProfilePic: false,
  isCheckingAuth: true,
  isDeletingUser: false,
  socket: null,

  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/currentUser");
      set({ authUser: res.message });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log("error occured:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/users/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully! Please log in.");
    } catch (error) {
      console.log("Error occured while signup", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/users/login", data);
      console.log(res);
      set({ authUser: res.data.message });
      toast.success("Successfully logged in");
      get().connectSocket();
    } catch (error) {
      console.log("Error while login");
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/users/logout");
      set({ authUser: null });
      toast.success("Successfully Logged out");
      get().disconnectSocket();
    } catch (error) {
      console.log("Error while logout", error);
      toast.error(error.response.message.data);
    }
  },

  updateProfilePic: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.post(
        "/users/updateProfilePic",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      set({ authUser: res.data.message });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error while updating profile", error);
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  deleteUser: async () => {
    set({ isDeletingUser: true });
    try {
      const res = await axiosInstance.delete("/users/deleteUser");
      set({ authUser: null });
      toast.success("Successfully deleted account");
      get().disconnectSocket();
    } catch (error) {
      console.log("Error while deleting user", error);
      toast.error(error.response?.data?.message || "Error deleting user");
    } finally {
      set({ isDeletingUser: true });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser.message._id,
      },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

  updateProfile: async () => {},
}));
