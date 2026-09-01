import axios from "axios";

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL;

  // Replace old/broken render subdomains if present in env variables
  if (url && (url.includes("healix-6fao") || url.includes("healix-f6ao"))) {
    url = "https://healix-backend-7gpc.onrender.com";
  }

  // In local development mode, fallback to local backend
  if (import.meta.env.DEV && (!url || url.includes("onrender.com"))) {
    url = "http://localhost:5000";
  }

  // Production fallback if VITE_API_URL is missing
  if (!url) {
    url = import.meta.env.DEV
      ? "http://localhost:5000"
      : "https://healix-backend-7gpc.onrender.com";
  }

  const trimmed = url.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const baseURL = getBaseURL();

const API = axios.create({
  baseURL,
  withCredentials: true,
});

if (!baseURL) {
  console.warn(
    "VITE_API_URL is not set. Production login will fail until it points to the deployed backend API.",
  );
}

export default API;
