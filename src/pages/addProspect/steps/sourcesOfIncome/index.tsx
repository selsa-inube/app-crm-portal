import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stack } from "@inubekit/inubekit";

import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { Fieldset } from "@components/data/Fieldset";
import { getCreditLimit } from "@services/creditRequest/getCreditLimit";
import { AppContext } from "@context/AppContext";
import { IIncomeSources } from "@services/incomeSources/types";
import { ICustomerData } from "@context/CustomerContext/types";

interface ISourcesOfIncomeProps {
  isMobile: boolean;
  customerData: ICustomerData;
}

export function SourcesOfIncome(props: ISourcesOfIncomeProps) {
  const { isMobile, customerData } = props;
  const { customerPublicCode } = useParams();
  const { businessUnitSigla } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const [creditLimitData, setCreditLimitData] = useState<IIncomeSources>();

  useEffect(() => {
    const fetchCreditLimit = async () => {
      try {
        const result = await getCreditLimit(
          businessUnitPublicCode,
          customerPublicCode!,
        );

        setCreditLimitData(result);
      } catch (error) {
        console.error("Error al obtener las solicitudes de crédito:", error);
        return null;
      }
    };
    fetchCreditLimit();
  }, []);

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
