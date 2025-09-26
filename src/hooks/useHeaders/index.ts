import { useIAuth } from "@inube/iauth-react";

export const useHeaders = () => {
  const { getAccessTokenSilently } = useIAuth();

  const getHeaders = async () => {
    const accessToken = await getAccessTokenSilently();
    return {
      "Content-type": "application/json; charset=UTF-8",
      "X-Business-unit": "test",
      Authorization: `Bearer ${accessToken}`,
    };
  };

  return { getHeaders };
};
