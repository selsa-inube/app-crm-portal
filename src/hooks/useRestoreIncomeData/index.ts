import { useContext, useState } from "react";
import { getCreditLimit } from "@services/creditLimit/getCreditLimit";
import { IIncomeSources } from "@services/creditLimit/types";
import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";

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
  const [isLoading, setIsLoading] = useState(false);

  const { customerData } = useContext(CustomerContext);
  const { businessUnitSigla } = useContext(AppContext);
  const customerPublicCode: string = customerData.publicCode;
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const restoreData = async () => {
    try {
      setIsLoading(true);
      const refreshedData = await getCreditLimit(
        businessUnitPublicCode,
        customerPublicCode,
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
