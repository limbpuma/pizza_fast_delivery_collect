import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store.js";
import "./i18n";
import { initializeOrderCache } from "./utils/orderCache.js";

// Initialize order cache on app startup
initializeOrderCache();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
