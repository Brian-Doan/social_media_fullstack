import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import "./index.css";

ReactDOM.render(
  <GoogleOAuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>,
  document.getElementById("root")
);
