const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const API = {
  BASE_URL:
    process.env.REACT_APP_API_URL ||
    (isLocalhost ? "http://localhost:9500" : "https://gentlerentals.onrender.com")
};
