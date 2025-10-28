import { useEffect, useState, useRef } from "react";
import { Stack } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { IIncomeSources } from "@services/creditLimit/types";
import { ICustomerData } from "@context/CustomerContext/types";
import { useRestoreIncomeData } from "@hooks/useRestoreIncomeData";

import { ISourcesOfIncomeState } from "../../types";
import { IProspect } from "@src/services/prospect/types";

interface ISourcesOfIncomeProps {
  isMobile: boolean;
  creditLimitData?: IIncomeSources;
  customerData: ICustomerData;
  initialValues: ISourcesOfIncomeState;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  prospectData: IProspect | undefined;
  handleOnChange: (newState: Partial<ISourcesOfIncomeState>) => void;
  isLoadingCreditLimit?: boolean;
}

export function SourcesOfIncome({
  customerData,
  creditLimitData,
  initialValues,
  businessUnitPublicCode,
  businessManagerCode,
  handleOnChange,
  isLoadingCreditLimit,
  prospectData,
}: ISourcesOfIncomeProps) {
  const [localData, setLocalData] = useState<IIncomeSources | null>(null);
  const hasInitialized = useRef(false);

  const { restoreData } = useRestoreIncomeData({
    onSuccess: (refreshedData) => {
      setLocalData(refreshedData);
      handleOnChange(refreshedData);
    },
  });
  const hasValidData = (data?: ISourcesOfIncomeState) =>
    !!data &&
    Object.values(data).some((value) => typeof value === "number" && value > 0);

  useEffect(() => {
    if (hasInitialized.current) return;

    if (hasValidData(initialValues)) {
      setLocalData(initialValues as unknown as IIncomeSources);
      hasInitialized.current = true;
    } else if (creditLimitData) {
      hasInitialized.current = true;
      setLocalData(creditLimitData);
      handleOnChange(creditLimitData);
    }
  }, [creditLimitData, initialValues]);

  const handleSourceIncomeChange = (newData: IIncomeSources) => {
    setLocalData(newData);
    handleOnChange(newData);
  };

  return (
    <Fieldset>
      <Stack direction="column" gap="16px">
        <SourceIncome
          data={localData || (initialValues as IIncomeSources)}
          customerData={customerData}
          onDataChange={handleSourceIncomeChange}
          onRestore={restoreData}
          publicCode={customerData?.publicCode || ""}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          showEdit
          disabled
          isLoadingCreditLimit={isLoadingCreditLimit}
          prospectData={prospectData}
        />
      </Stack>
    </Fieldset>
  );
}
