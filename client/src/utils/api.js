import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // ✅ backend port 3000
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.token = token; // ✅ fixed assignment
  return config;
});

export default API;
