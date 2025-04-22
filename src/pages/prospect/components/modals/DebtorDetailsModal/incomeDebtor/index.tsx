import { Stack } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { Fieldset } from "@components/data/Fieldset";
import { getPropertyValue } from "@pages/SubmitCreditApplication/util";
import { currencyFormat } from "@utils/formatData/currency";

import { dataIncomeDebtor } from "./config";

interface IIncomeDebtor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues: any;
}

const incomeFields = [
  {
    label: dataIncomeDebtor.work,
    keys: ["PeriodicSalary", "OtherNonSalaryEmoluments", "PensionAllowances"],
  },
  {
    label: dataIncomeDebtor.capital,
    keys: ["FinancialIncome", "Leases", "Dividends"],
  },
  {
    label: dataIncomeDebtor.variables,
    keys: ["ProfessionalFees", "PersonalBusinessUtilities"],
  },
];

export function IncomeDebtor(props: IIncomeDebtor) {
  const { initialValues } = props;

  return (
    <Fieldset>
      <Stack direction="column" padding="10px 16px" gap="16px">
        {incomeFields.map((field, index) => {
          const sum = field.keys.reduce((acc, key) => {
            const val = Number(
              getPropertyValue(initialValues.borrower_properties, key) ?? 0,
            );
            return acc + (isNaN(val) ? 0 : val);
          }, 0);

          return (
            <CardGray
              key={index}
              label={field.label}
              placeHolder={currencyFormat(sum)}
              apparencePlaceHolder="gray"
            />
          );
        })}
      </Stack>
    </Fieldset>
  );
}
