import { API } from "../../constant/apiConstant";
import { getAuthHeaders } from "../../utils/auth";
import { getErrorMessage, parseJsonSafely } from "../../utils/http";

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

      const json = await parseJsonSafely(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(response, json, "Unable to login"));
      }

      return json;
    } catch (error) {
      console.error("Error signing in account:", error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API.BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const json = await parseJsonSafely(response);

    if (!response.ok) {
      throw new Error(getErrorMessage(response, json, "Unable to request password reset"));
    }

    return json;
  },

  resetPassword: async ({ email, otp, newPassword }) => {
    const response = await fetch(`${API.BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, otp, newPassword })
    });

    const json = await parseJsonSafely(response);

    if (!response.ok) {
      throw new Error(getErrorMessage(response, json, "Unable to reset password"));
    }

    return json;
  },

  logout: async () => {
    try {
      const response = await fetch(`${API.BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        }
      });

      const json = await parseJsonSafely(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(response, json, "Unable to logout"));
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
          "Content-Type": "application/json",
          ...getAuthHeaders()
        }
      });

      const json = await parseJsonSafely(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(response, json, "Unable to fetch profile"));
      }

      return json;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }
};
