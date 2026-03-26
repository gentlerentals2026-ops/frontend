import { API } from "../../constant/apiConstant";
import { getAuthHeaders } from "../../utils/auth";
import { getErrorMessage, parseJsonSafely } from "../../utils/http";

export const QuotationService = {
  createQuotation: async (payload) => {
    const response = await fetch(`${API.BASE_URL}/api/quotations`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify(payload)
    });

    const json = await parseJsonSafely(response);

    if (!response.ok) {
      throw new Error(getErrorMessage(response, json, "Unable to create quotation"));
    }

    return json;
  }
};
