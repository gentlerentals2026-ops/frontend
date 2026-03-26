

export const API = {

  BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://api-gentlerentals.onrender.com"
      : "http://localhost:9600",

};