import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { LogoutOptions, RedirectLoginOptions } from "@auth0/auth0-react";

import { IAuthContextType } from "./types";
import { IUsers } from "../AppContext/types";

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

const isIUser = (obj: unknown): obj is IUsers => {
  return !!obj && typeof obj === "object" && "id" in obj;
};

interface AuthProviderProps {
  children: ReactNode;
  originatorId: string;
  callbackUrl: string;
  iAuthUrl: string;
}

export function AuthProvider({
  children,
  originatorId,
  callbackUrl,
  iAuthUrl,
}: AuthProviderProps) {
  const [user, setUser] = useState<IUsers | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleAuthCallback = useCallback(() => {
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    const accessCode = urlParams.get("ac");

    if (accessCode) {
      const userData: IUsers = {
        username: "username",
        nickname: "nickname",
        urlImgPerfil: "urlImgPerfil",
        company: "company",
        id: "id",
      };

      setUser(userData);
      setAccessToken(accessCode);
      setIsAuthenticated(true);
      localStorage.setItem("auth_token", accessCode);
      localStorage.setItem("auth_user", JSON.stringify(userData));
    } else {
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (isIUser(parsedUser)) {
            setUser(parsedUser);
            setAccessToken(storedToken);
            setIsAuthenticated(true);
          } else {
            throw new Error("Invalid user data");
          }
        } catch {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        }
      }
    }

    if (url.searchParams.has("ac")) {
      url.searchParams.delete("ac");

      const newRelative = url.pathname + url.search + url.hash;
      window.history.replaceState({}, document.title, newRelative);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    handleAuthCallback();
  }, [handleAuthCallback]);

  const loginWithRedirect = useCallback(
    (options?: RedirectLoginOptions) => {
      const loginUrl = new URL(iAuthUrl);
      loginUrl.searchParams.set("originatorId", originatorId);
      loginUrl.searchParams.set("callbackUrl", callbackUrl);

      if (options?.authorizationParams) {
        Object.entries(options.authorizationParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            const stringValue =
              typeof value === "string" ? value : JSON.stringify(value);
            loginUrl.searchParams.set(key, stringValue);
          }
        });
      }

      if (options?.appState) {
        Object.entries(options.appState).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            const stringValue =
              typeof value === "string" ? value : JSON.stringify(value);
            loginUrl.searchParams.set(key, stringValue);
          }
        });
      }

      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          if (
            key !== "authorizationParams" &&
            key !== "appState" &&
            value !== undefined &&
            value !== null
          ) {
            const stringValue =
              typeof value === "string" ? value : JSON.stringify(value);
            loginUrl.searchParams.set(key, stringValue);
          }
        });
      }

      window.location.href = loginUrl.toString();
    },
    [iAuthUrl, originatorId, callbackUrl],
  );

  const logout = useCallback((options?: LogoutOptions) => {
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    const returnTo = options?.logoutParams?.returnTo;
    if (returnTo && typeof returnTo === "string") {
      window.location.href = returnTo;
    }
  }, []);

  const getAccessTokenSilently = useCallback((): Promise<string> => {
    if (accessToken) return Promise.resolve(accessToken);
    return Promise.reject(new Error("No access token available"));
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContext };
