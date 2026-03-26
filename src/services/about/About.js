import { API } from "../../constant/apiConstant";

export const AboutService = {
  getAbout: async () => {
    const response = await fetch(`${API.BASE_URL}/api/about`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Unable to fetch about content");
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

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Unable to update about content");
    }

    return json;
  }
};
