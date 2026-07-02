

const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const productionApiUrl = process.env.REACT_APP_PRODUCTION_API_URL || "https://api.gentleevents.com";

export const API = {
  BASE_URL:
    isLocalhost
      ? process.env.REACT_APP_API_URL || "http://localhost:9600"
      : productionApiUrl
};
