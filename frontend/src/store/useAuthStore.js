import { create } from "zustand";
import { axiosInstance } from "../utils/axios.js";
import toast from "react-hot-toast";
import axios from "axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  // isUpdatingProfilePic: false,
  isCheckingAuth: true,
  isDeletingUser: false,

  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/currentUser");
      set({ authUser: res.data });
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
      // set({ authUser: res.data });
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
      set({ authUser: res.data });
      toast.success("Successfully logged in");
    } catch (error) {
      console.log("Error while login", error);
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
      set({ authUser: res.data });
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
    } catch (error) {
      console.log("Error while deleting user", error);
      toast.error(error.response?.data?.message || "Error deleting user");
    } finally {
      set({ isDeletingUser: true });
    }
  },

  updateProfile: async () => {},
}));
