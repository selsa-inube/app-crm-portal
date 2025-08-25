import { useState, useEffect } from "react";
import { Stack } from "@inubekit/inubekit";

import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { Fieldset } from "@components/data/Fieldset";
import { IIncomeSources } from "@services/creditLimit/types";
import { ICustomerData } from "@context/CustomerContext/types";

import { ISourcesOfIncomeState } from "../../types";

interface ISourcesOfIncomeProps {
  isMobile: boolean;
  creditLimitData?: IIncomeSources;
  customerData: ICustomerData;
  initialValues: ISourcesOfIncomeState;
  handleOnChange: (newState: Partial<ISourcesOfIncomeState>) => void;
}

export function SourcesOfIncome(props: ISourcesOfIncomeProps) {
  const {
    isMobile,
    customerData,
    creditLimitData,
    initialValues,
    handleOnChange,
  } = props;

  const [localData, setLocalData] = useState<IIncomeSources | undefined>(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      return initialValues as IIncomeSources;
    }
    return creditLimitData;
  });

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setLocalData(initialValues as IIncomeSources);
    }
  }, [initialValues]);

  useEffect(() => {
    if (
      creditLimitData &&
      (!initialValues || Object.keys(initialValues).length === 0)
    ) {
      setLocalData(creditLimitData);
    }
  }, [creditLimitData, initialValues]);

  const handleDataChange = (updatedData: IIncomeSources) => {
    setLocalData(updatedData);
    handleOnChange(updatedData as Partial<ISourcesOfIncomeState>);
  };

  return (
    <Fieldset>
      <Stack padding={isMobile ? "6px" : "0px"} justifyContent="center">
        <SourceIncome
          disabled={true}
          data={localData}
          customerData={customerData}
          onDataChange={handleDataChange}
        />
      </Stack>
    </Fieldset>
  );
}
