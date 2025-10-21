import { create } from "zustand";
import { axiosInstance } from "../utils/axios.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

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

  signup: async (data) => {},
}));
