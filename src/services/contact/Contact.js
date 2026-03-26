import { API } from "../../constant/apiConstant";
import { getErrorMessage, parseJsonSafely } from "../../utils/http";

export const ContactService = {
  submitMessage: async (payload) => {
    const response = await fetch(`${API.BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const json = await parseJsonSafely(response);

    if (!response.ok) {
      throw new Error(getErrorMessage(response, json, "Unable to send message"));
    }

    return json;
  }
};
