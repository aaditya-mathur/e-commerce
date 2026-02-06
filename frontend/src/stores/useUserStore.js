import { create } from "zustand";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  login: async (email, password) => {
    set({ loading: true });
    try {
      await axios.post("/auth/login", { email, password });
      await get().checkAuth();

      set({ loading: false });
      toast.success("Login successful!");
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
      return false;
    }
  },

  signUp: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      toast.error("Passwords do not match");
      return false;
    }

    try {
      await axios.post("/auth/signup", { name, email, password });

      await get().checkAuth();

      set({ loading: false });
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout",
      );
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const res = await axios.get("/auth/profile");
      const userData = res.data.data || res.data.user || res.data;
      set({
        user: userData,
        checkingAuth: false,
      });
    } catch (error) {
      set({ user: null, checkingAuth: false });
    }
  },
}));