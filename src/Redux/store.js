import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import AppState from "./Reducers/appState";
import { cartApi } from "../services/api/cartApi";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

const rootReducer = combineReducers({
  appState: AppState,
  [cartApi.reducerPath]: cartApi.reducer
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["appState"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(cartApi.middleware)
});
