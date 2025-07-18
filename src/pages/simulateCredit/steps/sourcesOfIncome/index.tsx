import { Stack } from "@inubekit/inubekit";

import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { Fieldset } from "@components/data/Fieldset";
import { IIncomeSources } from "@services/creditLimit/getIncomeSources/types";
import { ICustomerData } from "@context/CustomerContext/types";

interface ISourcesOfIncomeProps {
  isMobile: boolean;
  creditLimitData?: IIncomeSources;
  customerData: ICustomerData;
}

export function SourcesOfIncome(props: ISourcesOfIncomeProps) {
  const { isMobile, customerData, creditLimitData } = props;

  return (
    <Fieldset>
      <Stack padding={isMobile ? "6px" : "0px"} justifyContent="center">
        <SourceIncome
          disabled={true}
          data={creditLimitData}
          customerData={customerData}
        />
      </Stack>
    </Fieldset>
  );
}
