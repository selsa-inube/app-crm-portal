import { useState, useEffect } from "react";

import { useHeaders } from "@hooks/useHeaders";
import { postUserAccountsData } from "@services/userAccounts";
import { IPostUserAccountsResponse } from "@services/userAccounts/types";

import { useSignOut } from "../useSignOut";

const USER_ACCOUNTS_CACHE_KEY = "userAccountsData";
const USER_ACCOUNTS_TIMESTAMP_KEY = "userAccountsTimestamp";

const CACHE_EXPIRATION_TIME = 30 * 60 * 1000;

export const usePostUserAccountsData = (
  clientId: string,
  clientSecret: string,
) => {
  const [data, setData] = useState<IPostUserAccountsResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [codeError, setCodeError] = useState<number | undefined>(undefined);

  const { getHeaders } = useHeaders();
  const { signOut } = useSignOut();

  const isCacheValid = (): boolean => {
    const timestamp = localStorage.getItem(USER_ACCOUNTS_TIMESTAMP_KEY);
    if (!timestamp) return false;

    const now = Date.now();
    const cacheTime = parseInt(timestamp, 10);

    return now - cacheTime < CACHE_EXPIRATION_TIME;
  };

  function getFromCache() {
    try {
      const cachedData = localStorage.getItem(USER_ACCOUNTS_CACHE_KEY);
      if (cachedData && isCacheValid()) {
        return JSON.parse(cachedData);
      }
    } catch (error) {
      console.warn("Error al leer cache:", error);
    }
    return null;
  }

  const saveToCache = (responseData: IPostUserAccountsResponse): void => {
    try {
      localStorage.setItem(
        USER_ACCOUNTS_CACHE_KEY,
        JSON.stringify(responseData),
      );
      localStorage.setItem(USER_ACCOUNTS_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.warn("Error al guardar en cache:", error);
    }
  };

  const clearCache = (): void => {
    localStorage.removeItem(USER_ACCOUNTS_CACHE_KEY);
    localStorage.removeItem(USER_ACCOUNTS_TIMESTAMP_KEY);
  };

  useEffect(() => {
    const postUserAccounts = async () => {
      const cachedData = getFromCache();
      if (cachedData) {
        setData(cachedData);
        return cachedData;
      }

      setIsLoading(true);
      setError(null);

      try {
        const ac = localStorage.getItem("auth_token");

        if (!ac) {
          throw new Error('Token "ac" no encontrado en localStorage');
        }

        if (ac.trim() === "") {
          throw new Error('Token "ac" está vacío');
        }

        if (!clientId || !clientSecret) {
          throw new Error(
            "Los parámetros clientId y clientSecret son requeridos",
          );
        }

        const headers = await getHeaders();

        const response = await postUserAccountsData(
          ac,
          clientId,
          clientSecret,
          headers,
        );

        saveToCache(response);
        setData(response);
        return response;
      } catch (err) {
        const errorInstance =
          err instanceof Error ? err : new Error(String(err));
        setError(errorInstance);
        setCodeError(1006);

        clearCache();
        // signOut("/error?code=1006");
        throw errorInstance;
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId && clientSecret && localStorage.getItem("auth_token")) {
      postUserAccounts();
    }
  }, [clientId, clientSecret]);

  const reset = () => {
    setError(null);
    clearCache();
  };

  const refetch = async () => {
    clearCache();
    setError(null);

    if (clientId && clientSecret && localStorage.getItem("auth_token")) {
      setIsLoading(true);

      try {
        const ac = localStorage.getItem("auth_token");
        const headers = await getHeaders();
        const response = await postUserAccountsData(
          ac!,
          clientId,
          clientSecret,
          headers,
        );

        saveToCache(response);
        setData(response);
        return response;
      } catch (err) {
        const errorInstance =
          err instanceof Error ? err : new Error(String(err));
        setError(errorInstance);
        setCodeError(1006);
        // signOut("/error?code=1006");
        throw errorInstance;
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    data,
    isLoading,
    error,
    codeError,
    reset,
    refetch,
    clearCache,
  };
};
