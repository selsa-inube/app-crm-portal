import { useContext, useState } from "react";
import { getCreditLimit } from "@services/creditLimit/getCreditLimit";
import { IIncomeSources } from "@services/creditLimit/types";
import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";
import { useToken } from "@hooks/useToken";

interface UseRestoreIncomeDataProps {
  onSuccess?: (data: IIncomeSources) => void;
  setShowErrorModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageError?: (message: string) => void;
  onError?: (error: unknown) => void;
}

export function useRestoreIncomeData({
  onSuccess,
  setShowErrorModal,
  setMessageError,
}: UseRestoreIncomeDataProps = {}) {
  const { getAuthorizationToken } = useToken();

  const [isLoading, setIsLoading] = useState(false);

  const { customerData } = useContext(CustomerContext);
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const customerPublicCode: string = customerData.publicCode;
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const restoreData = async () => {
    try {
      setIsLoading(true);

      const authorizationToken = await getAuthorizationToken();

      const refreshedData = await getCreditLimit(
        businessUnitPublicCode,
        businessManagerCode,
        customerPublicCode,
        authorizationToken,
      );
      onSuccess?.(refreshedData);
      return refreshedData;
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");
      setShowErrorModal?.(true);
      setMessageError?.(description);
    } finally {
      setIsLoading(false);
    }
  };

  return { restoreData, isLoading };
}
