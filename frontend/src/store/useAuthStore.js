import { create } from "zustand";
import { axiosInstance } from "../utils/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8001"
    : "https://flux-backend-orpin.vercel.app/";

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
      // backend -> APIresponse(200, "Current user displayed", req.user)
      set({ authUser: res.data.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error while checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/users/signup", data);
      toast.success(res.data.message || "Account created successfully!");
      set({ authUser: res.data.data });
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/users/login", data);

      // Backend: new APIresponse(200, "Login successfully", userLogin)
      set({ authUser: res.data.data });
      toast.success(res.data.message || "Successfully logged in");
      get().connectSocket();
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/users/logout");
      set({ authUser: null });
      toast.success(res.data.message || "Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfilePic: async (formData) => {
    set({ isUpdatingProfilePic: true });
    try {
      const res = await axiosInstance.post(
        "/users/updateProfilePic",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      set({ authUser: res.data.data });
      toast.success(res.data.message || "Profile picture updated");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error(
        error.response?.data?.message || "Error updating profile pic"
      );
    } finally {
      set({ isUpdatingProfilePic: false });
    }
  },

  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/users/updateProfile", formData);
      set({ authUser: res.data.data });
      toast.success(res.data.message || "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  deleteUser: async () => {
    set({ isDeletingUser: true });
    try {
      const res = await axiosInstance.delete("/users/deleteUser");
      toast.success(res.data.message || "Account deleted successfully");
      set({ authUser: null });
      get().disconnectSocket();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Error deleting account");
    } finally {
      set({ isDeletingUser: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
