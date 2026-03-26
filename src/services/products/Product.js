import { API } from "../../constant/apiConstant";
import { getErrorMessage, parseJsonSafely } from "../../utils/http";

export const ProductService = {
  getProducts: async () => {
    try {
      const endpoint = `${API.BASE_URL}/api/products`;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const json = await parseJsonSafely(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(response, json, `Failed to fetch products from ${endpoint}`));
      }

      return json;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProductBySlug: async (slug) => {
    try {
      const endpoint = `${API.BASE_URL}/api/products/slug/${slug}`;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const json = await parseJsonSafely(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(response, json, `Failed to fetch product from ${endpoint}`));
      }

      return json;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }
};
