import { environment } from "@config/environment";
import { useIAuth } from "@context/AuthContext/useAuthContext";
export const useSignOut = () => {
  const { logout } = useIAuth();

  const signOut = (redirect?: string) => {
    localStorage.clear();
    if (!redirect) {
      logout({ logoutParams: { returnTo: environment.REDIRECT_URI } });
    } else {
      logout({
        logoutParams: { returnTo: environment.REDIRECT_URI + redirect },
      });
    }
    return null;
  };

  return { signOut };
};
