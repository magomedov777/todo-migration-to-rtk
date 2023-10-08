import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App";
import { store } from "./app/store";
import { Provider } from "react-redux";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
