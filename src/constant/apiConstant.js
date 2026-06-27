

export const API = {
  BASE_URL:
    process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PRODUCTION_API_URL || "https://api.gentleevents.com"
      : "http://localhost:9600")
};
