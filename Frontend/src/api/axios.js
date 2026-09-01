import axios from "axios";

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL;

  // In local development mode, fallback to local backend if VITE_API_URL is not set or points to remote render app
  if (import.meta.env.DEV && (!url || url.includes("onrender.com"))) {
    url = "http://localhost:5000";
  }

  if (!url) {
    url = import.meta.env.DEV ? "http://localhost:5000" : "";
  }

  if (!url) return "";

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
