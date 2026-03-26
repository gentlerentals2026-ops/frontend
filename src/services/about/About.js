import { API } from "../../constant/apiConstant";
import { getErrorMessage, parseJsonSafely } from "../../utils/http";

export const AboutService = {
  getAbout: async () => {
    const response = await fetch(`${API.BASE_URL}/api/about`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const json = await parseJsonSafely(response);

    if (!response.ok) {
      throw new Error(getErrorMessage(response, json, "Unable to fetch about content"));
    }

    return json;
  },

  updateAbout: async (payload) => {
    const response = await fetch(`${API.BASE_URL}/api/about`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const json = await parseJsonSafely(response);

    if (!response.ok) {
      throw new Error(getErrorMessage(response, json, "Unable to update about content"));
    }

    return json;
  }
};
