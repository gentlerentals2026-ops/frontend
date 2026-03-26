import { store } from "../Redux/store";

export const getAccessToken = () => {
  const state = store.getState();
  return state?.appState?.acesssToken || "";
};

export const getAuthHeaders = () => {
  const token = getAccessToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`
  };
};
