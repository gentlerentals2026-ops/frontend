import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from './Redux/store';
import { Provider } from'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist'
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import theme from "./theme";
const persistor = persistStore(store)

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
          <App />
    </BrowserRouter>
  </ThemeProvider>
   </PersistGate>
  </Provider>,
);
