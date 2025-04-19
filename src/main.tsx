import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { FlagProvider } from "@inubekit/inubekit";

import { environment } from "./config/environment.ts";
import App from "./App.tsx";

const redirect_uri = environment.REDIRECT_URI;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={environment.AUTH0_DOMAIN}
      clientId={environment.CLIENT_ID}
      authorizationParams={{
        redirect_uri,
      }}
    >
      <FlagProvider>
        <App />
      </FlagProvider>
    </Auth0Provider>
  </StrictMode>,
);
