import { LogoutOptions, RedirectLoginOptions } from "@auth0/auth0-react";
import { IUsers } from "../AppContext/types";

interface IAuthContextType {
  user: IUsers | null;
  setUser: React.Dispatch<React.SetStateAction<IUsers | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithRedirect: (options?: RedirectLoginOptions) => void;
  logout: (options?: LogoutOptions) => void;
  getAccessTokenSilently: () => Promise<string>;
}

export type { IAuthContextType };
