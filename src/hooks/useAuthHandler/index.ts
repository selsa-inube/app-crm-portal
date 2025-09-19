import { useEffect } from "react";
import { useIAuth } from "@inube/iauth-react";

interface AuthConfig {
  clientId: string;
  clientSecret: string;
}

const useAuthHandler = (
  authConfig: AuthConfig | null,
  hasAuthError: boolean,
  portalCode: string,
) => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useIAuth();

  useEffect(() => {
    if (
      !hasAuthError &&
      authConfig &&
      portalCode &&
      !isAuthenticated &&
      !isLoading
    ) {
      loginWithRedirect();
    }
  }, [
    authConfig,
    hasAuthError,
    portalCode,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
  ]);

  return {
    isAuthenticated,
    isLoading,
    shouldRedirect:
      !hasAuthError &&
      authConfig &&
      portalCode &&
      !isAuthenticated &&
      !isLoading,
  };
};

export { useAuthHandler };
