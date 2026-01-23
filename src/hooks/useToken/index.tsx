import { useIAuth } from "@inube/iauth-react";

export const useToken = () => {
  const { getAccessTokenSilently } = useIAuth();

  const getAuthorizationToken = async (): Promise<string> => {
    try {
      return await getAccessTokenSilently();
    } catch (error) {
      throw error;
    }
  };

  return { getAuthorizationToken };
};
