import axios from "axios";

const fallbackBaseURL =
  import.meta.env.DEV ? "http://localhost:5000/api" : `${window.location.origin}/api`;

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || fallbackBaseURL,
});

export default API;
