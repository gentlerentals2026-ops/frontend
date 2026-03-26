import { API } from "../../constant/apiConstant";

export const AuthService = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API.BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Unable to login");
      }

      return json;
    } catch (error) {
      console.error("Error signing in account:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API.BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Unable to logout");
      }

      return json;
    } catch (error) {
      console.error("Error signing in account:", error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await fetch(`${API.BASE_URL}/api/auth/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Unable to fetch profile");
      }

      return json;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }
};
