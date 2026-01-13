import { Stack } from "@inubekit/inubekit";
import { FormikValues } from "formik";

import { CardGray } from "@components/cards/CardGray";
import { Fieldset } from "@components/data/Fieldset";
import { getPropertyValue } from "@utils/mappingData/mappings";
import { currencyFormat } from "@utils/formatData/currency";
import { IncomeTypes } from "@services/enum/icorebanking-vi-crediboard/eincometype";

interface IIncomeDebtor {
  initialValues: FormikValues | undefined;
}
const uniqueTypes = Array.from(
  new Set(IncomeTypes.map((source) => source.TypeEs)),
);

const incomeFields = uniqueTypes.map((typeEs) => {
  const items = IncomeTypes.filter((source) => source.TypeEs === typeEs);
  return {
    label: typeEs,
    keys: items.map((source) => source.Code),
  };
});

export function IncomeDebtor(props: IIncomeDebtor) {
  const { initialValues } = props;
  if (!initialValues || !initialValues.borrowerProperties) {
    return (
      <Fieldset>
        <Stack direction="column" padding="10px 16px" gap="16px">
          {incomeFields.map((field, index) => (
            <CardGray
              key={index}
              label={field.label}
              placeHolder={currencyFormat(0)}
              appearancePlaceHolder="gray"
            />
          ))}
        </Stack>
      </Fieldset>
    );
  }

  return (
    <Fieldset>
      <Stack direction="column" padding="10px 16px" gap="16px">
        {incomeFields.map((field, index) => {
          const sum = field.keys.reduce((acc, key) => {
            const val = Number(
              getPropertyValue(initialValues.borrowerProperties, key) ?? 0,
            );
            return acc + (isNaN(val) ? 0 : val);
          }, 0);

          return (
            <CardGray
              key={index}
              label={field.label}
              placeHolder={currencyFormat(sum)}
              appearancePlaceHolder="gray"
            />
          );
        })}
      </Stack>
    </Fieldset>
  );
}
