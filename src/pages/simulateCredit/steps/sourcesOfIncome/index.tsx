import { useEffect, useState } from "react";
import { Stack } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { IIncomeSources } from "@services/creditLimit/types";
import { ICustomerData } from "@context/CustomerContext/types";
import { useRestoreIncomeData } from "@hooks/useRestoreIncomeData";

import { ISourcesOfIncomeState } from "../../types";

interface ISourcesOfIncomeProps {
  isMobile: boolean;
  creditLimitData?: IIncomeSources;
  customerData: ICustomerData;
  initialValues: ISourcesOfIncomeState;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  handleOnChange: (newState: Partial<ISourcesOfIncomeState>) => void;
}

export function SourcesOfIncome({
  customerData,
  creditLimitData,
  initialValues,
  businessUnitPublicCode,
  businessManagerCode,
  handleOnChange,
}: ISourcesOfIncomeProps) {
  const [localData, setLocalData] = useState<IIncomeSources | null>(null);

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
    if (hasValidData(initialValues)) {
      setLocalData(initialValues as unknown as IIncomeSources);
    } else if (creditLimitData) {
      setLocalData(creditLimitData);
      handleOnChange(creditLimitData);
    }
  }, [creditLimitData, initialValues, handleOnChange]);

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
        />
      </Stack>
    </Fieldset>
  );
}
