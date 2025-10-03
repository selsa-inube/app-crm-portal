import { useEffect } from "react";
import { useIAuth } from "@inube/iauth-react";
import { useSignOut } from "../useSignOut";

interface IAuthConfig {
  clientId: string;
  clientSecret: string;
}

const useAuthHandler = (
  authConfig: IAuthConfig | null,
  hasAuthError: boolean,
  portalCode: string,
) => {
  const { loginWithRedirect, isAuthenticated, isLoading, error } = useIAuth();
  const { signOut } = useSignOut();

  if (error) {
    signOut("/error?code=1009");
  }
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
