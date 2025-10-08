import { useContext, useEffect, useState } from "react";

import { AppContext } from "@context/AppContext";
import { EPayrollAgreement } from "@services/enum/crm";

const useValidateUseCase = (props: { useCase: string }) => {
  const { useCase } = props;
  const [disabledButton, setDisabledButton] = useState<boolean>(false);

  const { eventData } = useContext(AppContext);
  const useCasesData = eventData?.user?.staff?.useCases;

  useEffect(() => {
    if (useCasesData) {
      const validateUseCase = useCasesData.includes(useCase);
      setDisabledButton(!validateUseCase);
      disabledButton;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useCasesData]);

  return {
    disabledButton: false,
  };
};
const getUseCaseValue = (code: string) => {
  return EPayrollAgreement.find((item) => item.Code === code)?.Value ?? "";
};
export { useValidateUseCase, getUseCaseValue };
