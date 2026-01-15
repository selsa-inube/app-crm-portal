import { IncomeCard } from "@components/cards/IncomeCard";
import { ICustomerData } from "@context/CustomerContext/types";
import { IncomeTypes } from "@services/enum/icorebanking-vi-crediboard/eincometype";
import { EnumType } from "@hooks/useEnum/useEnum";

import { IIncome } from "./types";

interface IncomeProps {
  values: string[];
  lang: EnumType;
  ShowSupport?: boolean;
  disabled?: boolean;
  onValueChange?: (index: number, newValue: string) => void;
}

function IncomeCapital({
  values,
  lang,
  ShowSupport,
  disabled,
  onValueChange,
}: IncomeProps) {
  const capitalSources = IncomeTypes.filter(
    (src) => src.Type === "Capital income",
  );
  return (
    <IncomeCard
      title={capitalSources[0]?.TypeEs ?? ""}
      labels={capitalSources.map((source) => source.DescriptionEs ?? "")}
      placeholders={capitalSources.map(
        (source) => `${source.DescriptionEs}/mes`,
      )}
      values={values}
      ShowSupport={ShowSupport}
      disabled={disabled}
      onValueChange={onValueChange}
      lang={lang}
    />
  );
}

function IncomeEmployment({
  values,
  lang,
  ShowSupport,
  disabled,
  onValueChange,
}: IncomeProps) {
  const employmentSources = IncomeTypes.filter(
    (src) => src.Type === "Employment income",
  );

  return (
    <IncomeCard
      title={employmentSources[0]?.TypeEs ?? ""}
      labels={employmentSources.map((source) => source.DescriptionEs ?? "")}
      placeholders={employmentSources.map(
        (source) => `${source.DescriptionEs}/mes`,
      )}
      values={values}
      ShowSupport={ShowSupport}
      disabled={disabled}
      onValueChange={onValueChange}
      lang={lang}
    />
  );
}

function MicroBusinesses({
  values,
  lang,
  ShowSupport,
  disabled,
  onValueChange,
}: IncomeProps) {
  const variableSources = IncomeTypes.filter(
    (src) =>
      src.Type === "Professional fees" ||
      src.Type === "Earnings from ventures or micro-businesses",
  );
  return (
    <IncomeCard
      title={variableSources[0]?.TypeEs ?? ""}
      labels={variableSources.map((source) => source.DescriptionEs ?? "")}
      placeholders={variableSources.map(
        (source) => `${source.DescriptionEs}/mes`,
      )}
      values={values}
      ShowSupport={ShowSupport}
      disabled={disabled}
      onValueChange={onValueChange}
      lang={lang}
    />
  );
}

function getInitialValues(customerData: ICustomerData) {
  return {
    borrower_id: customerData?.publicCode ?? "",
    borrower: customerData?.fullName ?? "",
    capital: ["0", "0", "0"],
    employment: ["0", "0", "0"],
    businesses: ["0", "0"],
  } as IIncome;
}

export { IncomeCapital, IncomeEmployment, MicroBusinesses, getInitialValues };
