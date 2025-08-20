import { useState } from "react";
import { FormikValues } from "formik";
import { Stack } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { IObligations } from "@services/creditRequest/types";

interface IObligationsFinancialProps {
  isMobile: boolean;
  clientPortfolio: IObligations;
  initialValues: IObligations | null;
  setFormState: React.Dispatch<
    React.SetStateAction<{
      type: string;
      entity: string;
      fee: string;
      balance: string;
      payment: string;
      feePaid: string;
      term: string;
      idUser: string;
    }>
  >;
  formState: {
    type: string;
    entity: string;
    fee: string;
    balance: string;
    payment: string;
    feePaid: string;
    term: string;
    idUser: string;
  };
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: FormikValues) => void;
}

export function ObligationsFinancial(props: IObligationsFinancialProps) {
  const {
    isMobile,
    clientPortfolio,
    formState,
    handleOnChange,
    initialValues,
  } = props;

  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Fieldset>
      <Stack direction="column" height="auto" gap="20px" />
      <Stack
        width="auto"
        justifyContent="center"
        direction="column"
        margin={isMobile ? "none" : "16px"}
      >
        <TableFinancialObligations
          refreshKey={refreshKey}
          setRefreshKey={setRefreshKey}
          showActions
          showButtons={false}
          clientPortfolio={clientPortfolio}
          initialValues={initialValues as IObligations}
          handleOnChange={handleOnChange}
          formState={formState}
        />
      </Stack>
    </Fieldset>
  );
}
