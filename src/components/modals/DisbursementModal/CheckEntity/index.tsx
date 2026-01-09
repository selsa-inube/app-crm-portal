import { Stack, Grid } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { CardGray } from "@components/cards/CardGray";
import { EnumType } from "@hooks/useEnum/useEnum";

import { disbursementGeneral, disbursemenOptionAccount } from "../config";
import { dataTabsDisbursement } from "../types";

export interface IDisbursement {
  isMobile: boolean;
  data: dataTabsDisbursement;
  lang: EnumType;
}

export function DisbursementCheckEntity(props: IDisbursement) {
  const { isMobile, data, lang } = props;
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
          label={disbursementGeneral.label.i18n[lang]}
          placeHolder={currencyFormat(Number(data.disbursementAmount), false)}
        />
        <CardGray
          label={disbursementGeneral.labelToggle.i18n[lang]}
          placeHolder={data.isInTheNameOfBorrower}
        />
        <CardGray
          label={disbursemenOptionAccount.labelName.i18n[lang]}
          placeHolder={data.payeeName}
        />
        <CardGray
          label={disbursemenOptionAccount.labelLastName.i18n[lang]}
          placeHolder={data.payeeSurname}
        />
        <CardGray
          label={disbursemenOptionAccount.labelSex.i18n[lang]}
          placeHolder={data.payeeBiologicalSex}
        />
        <CardGray
          label={disbursemenOptionAccount.labelDocumentType.i18n[lang]}
          placeHolder={data.payeeIdentificationType}
        />
        <CardGray
          label={disbursemenOptionAccount.labelDocumentNumber.i18n[lang]}
          placeHolder={data.payeeIdentificationNumber}
        />
        <CardGray
          label={disbursemenOptionAccount.labelBirthdate.i18n[lang]}
          placeHolder={data.payeeBirthday}
        />
        <CardGray
          label={disbursemenOptionAccount.labelphone.i18n[lang]}
          placeHolder={data.payeePhoneNumber}
        />
        <CardGray
          label={disbursemenOptionAccount.labelMail.i18n[lang]}
          placeHolder={data.payeeEmail}
        />
        <CardGray
          label={disbursemenOptionAccount.labelCity.i18n[lang]}
          placeHolder={data.payeeCityOfResidence}
        />
      </Grid>
      <CardGray
        label={disbursemenOptionAccount.observation.i18n[lang]}
        placeHolder={data.observation}
      />
    </Stack>
  );
}
