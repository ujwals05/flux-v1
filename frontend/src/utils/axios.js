import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8001/api" // when local
      : "/api", 
  withCredentials: true,
});
