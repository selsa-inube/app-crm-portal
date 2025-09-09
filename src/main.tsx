import React from "react";
import ReactDOM from "react-dom/client";

import { AuthProvider } from "@context/AuthContext";

import { environment } from "./config/environment";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AuthProvider
      originatorId={environment.ORIGINATOR_ID}
      callbackUrl={environment.REDIRECT_URI}
      iAuthUrl={environment.IAUTH_URL}
    >
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
