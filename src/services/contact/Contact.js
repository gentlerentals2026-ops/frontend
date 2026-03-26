import { API } from "../../constant/apiConstant";

export const ContactService = {
  submitMessage: async (payload) => {
    const response = await fetch(`${API.BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Unable to send message");
    }

    return json;
  }
};
