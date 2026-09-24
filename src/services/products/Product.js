import { API } from "../../constant/apiConstant";
import { getErrorMessage, parseJsonSafely } from "../../utils/http";

export const ProductService = {
  getRentalCategories: async () => {
    const response = await fetch(`${API.BASE_URL}/api/categories`, { cache: "no-store" });
    const json = await parseJsonSafely(response);
    if (!response.ok) throw new Error(getErrorMessage(response, json, "Failed to fetch rental categories"));
    return json;
  },
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
