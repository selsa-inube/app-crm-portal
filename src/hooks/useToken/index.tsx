import { useIAuth } from "@inube/iauth-react";

export const useToken = () => {
  const { getAccessTokenSilently } = useIAuth();

  const getAuthorizationToken = async (): Promise<string> => {
    return await getAccessTokenSilently();
  };

  return { getAuthorizationToken };
};
