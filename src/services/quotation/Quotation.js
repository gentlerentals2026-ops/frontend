import { API } from "../../constant/apiConstant";

export const QuotationService = {
  createQuotation: async (payload) => {
    const response = await fetch(`${API.BASE_URL}/api/quotations`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Unable to create quotation");
    }

    return json;
  }
};
