import React from "react";
import ReactDOM from "react-dom/client";

import { environment } from "./config/environment";
import App from "./App";
import { AuthProvider } from "./context/authContext";

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
