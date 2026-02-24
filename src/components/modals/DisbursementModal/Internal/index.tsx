import { Stack, Grid } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { CardGray } from "@components/cards/CardGray";
import { formatPrimaryDate } from "@utils/formatData/date";
import { capitalizeFirstLetter } from "@utils/formatData/text";
import { IAllEnumsResponse } from "@services/enumerators/types";

import {
  formatBiologicalSex,
  formatNoData,
  formatObservation,
  formatYesNo,
} from "../utils";
import {
  disbursementGeneralEnum,
  disbursemenOptionAccountEnum,
} from "../config";
import { dataTabsDisbursement } from "../types";

export interface IDisbursement {
  isMobile: boolean;
  data: dataTabsDisbursement;
  lang: "es" | "en";
  enums: IAllEnumsResponse | null;
}

export function DisbursementInternal(props: IDisbursement) {
  const { isMobile, data, lang, enums } = props;

  return (
    <Stack
      direction="column"
      gap="16px"
      width={isMobile ? "265px" : "582px"}
      height="auto"
    >
      <Grid
        templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
        gap="16px 20px"
        autoRows="auto"
        justifyContent="space-between"
      >
        <CardGray
          label={disbursementGeneralEnum.label.i18n[lang]}
          placeHolder={currencyFormat(Number(data.disbursementAmount), false)}
        />
        <CardGray
          label={disbursementGeneralEnum.labelToggle.i18n[lang]}
          placeHolder={formatYesNo(data.isInTheNameOfBorrower)}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelName.i18n[lang]}
          placeHolder={data.payeeName}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelLastName.i18n[lang]}
          placeHolder={data.payeeSurname}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelSex.i18n[lang]}
          placeHolder={formatBiologicalSex(data.payeeBiologicalSex)}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelDocumentType.i18n[lang]}
          placeHolder={data.payeeIdentificationType}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelDocumentNumber.i18n[lang]}
          placeHolder={data.payeeIdentificationNumber}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelBirthdate.i18n[lang]}
          placeHolder={formatPrimaryDate(new Date(data.payeeBirthday))}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelphone.i18n[lang]}
          placeHolder={data.payeePhoneNumber}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelMail.i18n[lang]}
          placeHolder={data.payeeEmail}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelCity.i18n[lang]}
          placeHolder={capitalizeFirstLetter(data.payeeCityOfResidence)}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelAccount.i18n[lang]}
          placeHolder={`${data.accountNumber} - ${enums?.AccountType?.find((item) => item.code === data.accountType)?.i18n[lang] ?? data.accountType} - ${data.accountBankName}`}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.paymentOrderReference.i18n[lang]}
          placeHolder={formatNoData(data.paymentOrderReference)}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.disbursemerntRefernce.i18n[lang]}
          placeHolder={formatNoData(data.disbursementReference)}
        />
      </Grid>
      <CardGray
        label={disbursemenOptionAccountEnum.observation.i18n[lang]}
        placeHolder={formatObservation(data.observation)}
      />
    </Stack>
  );
}
