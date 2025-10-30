import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8001/api/v1"
      : "/api",
  withCredentials: true,
});
