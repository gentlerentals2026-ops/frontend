import { API } from "../../constant/apiConstant";

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

      if (!response.ok) {
        throw new Error(`Failed to fetch products from ${endpoint}`);
      }

      const json = await response.json();
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

      if (!response.ok) {
        throw new Error(`Failed to fetch product from ${endpoint}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }
};
