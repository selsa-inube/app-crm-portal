import { Stack, Grid } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { CardGray } from "@components/cards/CardGray";

import { dataTabsDisbursement } from "../types";
import { disbursementGeneral, disbursemenOptionAccount } from "../config";

export interface IDisbursement {
  isMobile: boolean;
  data: dataTabsDisbursement;
}

export function DisbursementChequeManagement(props: IDisbursement) {
  const { isMobile, data } = props;
  return (
    <Stack
      direction="column"
      gap="16px"
      width={isMobile ? "265px" : "582px"}
      height={isMobile ? "294px" : "auto"}
    >
      <Grid
        templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
        gap="16px 20px"
        autoRows="auto"
      >
        <CardGray
          label={disbursementGeneral.label}
          placeHolder={currencyFormat(Number(data.disbursementAmount), false)}
        />
        <CardGray
          label={disbursementGeneral.labelToggle}
          placeHolder={data.isInTheNameOfBorrower}
        />
        <CardGray
          label={disbursemenOptionAccount.labelName}
          placeHolder={data.payeeName}
        />
        <CardGray
          label={disbursemenOptionAccount.labelLastName}
          placeHolder={data.payeeSurname}
        />
        <CardGray
          label={disbursemenOptionAccount.labelSex}
          placeHolder={data.payeeBiologicalSex}
        />
        <CardGray
          label={disbursemenOptionAccount.labelDocumentType}
          placeHolder={data.payeeIdentificationType}
        />
        <CardGray
          label={disbursemenOptionAccount.labelDocumentNumber}
          placeHolder={data.payeeIdentificationNumber}
        />
        <CardGray
          label={disbursemenOptionAccount.labelBirthdate}
          placeHolder={data.payeeBirthday}
        />
        <CardGray
          label={disbursemenOptionAccount.labelphone}
          placeHolder={data.payeePhoneNumber}
        />
        <CardGray
          label={disbursemenOptionAccount.labelMail}
          placeHolder={data.payeeEmail}
        />
        <CardGray
          label={disbursemenOptionAccount.labelCity}
          placeHolder={data.payeeCityOfResidence}
        />
      </Grid>
      <CardGray
        label={disbursemenOptionAccount.observation}
        placeHolder={data.observation}
      />
    </Stack>
  );
}
