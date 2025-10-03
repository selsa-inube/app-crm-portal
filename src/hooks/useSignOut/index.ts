import { useIAuth } from "@inube/iauth-react";
import { environment } from "@config/environment";

export const useSignOut = () => {
  const { logout } = useIAuth();

  const signOut = (redirect?: string) => {
    localStorage.clear();
    if (!redirect) {
      logout({ logoutParams: { returnTo: environment.REDIRECT_URI } });
    } else {
      logout({ logoutParams: { returnTo: window.location.origin + redirect } });
    }
    return null;
  };

  return { signOut };
};
