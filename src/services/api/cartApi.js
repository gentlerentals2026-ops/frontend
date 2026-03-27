import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API } from "../../constant/apiConstant";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API.BASE_URL}/api`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.appState?.acesssToken;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    }
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"]
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity = 1 }) => ({
        url: "/cart/items",
        method: "POST",
        body: { productId, quantity }
      }),
      invalidatesTags: ["Cart"]
    }),
    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/cart/items/${productId}`,
        method: "PATCH",
        body: { quantity }
      }),
      invalidatesTags: ["Cart"]
    }),
    removeCartItem: builder.mutation({
      query: (productId) => ({
        url: `/cart/items/${productId}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Cart"]
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: "/cart",
        method: "DELETE"
      }),
      invalidatesTags: ["Cart"]
    })
  })
});

export const {
  useAddToCartMutation,
  useClearCartMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation
} = cartApi;
