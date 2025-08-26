import { IncomeCard } from "@components/cards/IncomeCard";
import { ICustomerData } from "@context/CustomerContext/types";
import { IncomeTypes } from "@services/enum/icorebanking-vi-crediboard/eincometype";

import { IIncome } from "./types";

interface IncomeProps {
  values: string[];
  ShowSupport?: boolean;
  disabled?: boolean;
  onValueChange?: (index: number, newValue: string) => void;
}

function IncomeCapital({
  values,
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
      labels={capitalSources.map((src) => src.DescriptionEs ?? "")}
      placeholders={capitalSources.map((src) => `${src.DescriptionEs}/mes`)}
      values={values}
      ShowSupport={ShowSupport}
      disabled={disabled}
      onValueChange={onValueChange}
    />
  );
}

function IncomeEmployment({
  values,
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
      labels={employmentSources.map((src) => src.DescriptionEs ?? "")}
      placeholders={employmentSources.map((src) => `${src.DescriptionEs}/mes`)}
      values={values}
      ShowSupport={ShowSupport}
      disabled={disabled}
      onValueChange={onValueChange}
    />
  );
}

function MicroBusinesses({
  values,
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
      labels={variableSources.map((src) => src.DescriptionEs ?? "")}
      placeholders={variableSources.map((src) => `${src.DescriptionEs}/mes`)}
      values={values}
      ShowSupport={ShowSupport}
      disabled={disabled}
      onValueChange={onValueChange}
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
