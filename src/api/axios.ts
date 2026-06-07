import axios from "axios";
import { storage } from "../utils";
import { STORAGE_KEYS } from "../constants/app.constants";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = storage.get<string>(STORAGE_KEYS.TOKEN);

  if (token) {
    config.headers.set?.("Authorization", `Bearer ${token}`);

    // fallback
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;