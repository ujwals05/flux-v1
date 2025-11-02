import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8001/api" // when local
      : "https://flux-backend.vercel.app/api",
  withCredentials: true,
});
