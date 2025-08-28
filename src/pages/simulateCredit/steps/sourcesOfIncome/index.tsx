import { useEffect, useState, useRef } from "react";
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
  handleOnChange: (newState: Partial<ISourcesOfIncomeState>) => void;
}

export function SourcesOfIncome(props: ISourcesOfIncomeProps) {
  const { customerData, creditLimitData, initialValues, handleOnChange } =
    props;

  const [localData, setLocalData] = useState<IIncomeSources | null>(null);
  const hasInitialized = useRef(false);

  const { restoreData } = useRestoreIncomeData({
    onSuccess: (refreshedData) => {
      setLocalData(refreshedData);
      handleOnChange(refreshedData);
    },
  });

  useEffect(() => {
    if (creditLimitData && !hasInitialized.current) {
      const hasValidData =
        initialValues &&
        Object.values(initialValues).some(
          (value) =>
            value !== "" &&
            value !== 0 &&
            value !== null &&
            value !== undefined,
        );

      setLocalData(
        hasValidData
          ? (initialValues as unknown as IIncomeSources)
          : creditLimitData,
      );

      hasInitialized.current = true;
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
          data={localData || ({} as IIncomeSources)}
          customerData={customerData}
          onDataChange={handleSourceIncomeChange}
          onRestore={restoreData}
          showEdit={true}
          disabled={true}
        />
      </Stack>
    </Fieldset>
  );
}
