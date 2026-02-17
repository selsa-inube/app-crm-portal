import { useEffect } from "react";
import { useIAuth } from "@inube/iauth-react";

interface IAuthConfig {
  clientId: string;
  clientSecret: string;
}

const useAuthHandler = (
  authConfig: IAuthConfig | null,
  hasAuthError: boolean,
  portalCode: string,
) => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useIAuth();

  useEffect(() => {
    const isLogoutRoute = window.location.pathname === "/logout";

    if (
      !hasAuthError &&
      authConfig &&
      portalCode &&
      !isAuthenticated &&
      !isLoading &&
      !isLogoutRoute
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
