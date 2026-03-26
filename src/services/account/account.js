import { API } from "../../constant/apiConstant";
import { getErrorMessage, parseJsonSafely } from "../../utils/http";

export const AccountService = {
  register: async (user) => {
    try {
      const response = await fetch(`${API.BASE_URL}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      const json = await parseJsonSafely(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(response, json, "Unable to create account"));
      }

      return json;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }
};
