import { IncomeCard } from "@components/cards/IncomeCard";
import { ICustomerData } from "@context/CustomerContext/types";
import { IncomeTypes } from "@services/enum/icorebanking-vi-crediboard/eincometype";
import { IProspect, IBorrower } from "@services/prospect/types";

import { IBorrowerIncomeData } from "../AddProductModal/config";
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
      labels={capitalSources.map((source) => source.DescriptionEs ?? "")}
      placeholders={capitalSources.map(
        (source) => `${source.DescriptionEs}/mes`,
      )}
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
      labels={employmentSources.map((source) => source.DescriptionEs ?? "")}
      placeholders={employmentSources.map(
        (source) => `${source.DescriptionEs}/mes`,
      )}
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
      labels={variableSources.map((source) => source.DescriptionEs ?? "")}
      placeholders={variableSources.map(
        (source) => `${source.DescriptionEs}/mes`,
      )}
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

const getMainBorrower = (borrowers: IBorrower[]) => {
  return borrowers.find((borrower: IBorrower) => {
    borrower.borrowerType === "MainBorrower";
  });
};

export const mapIncomesFromProspect = (prospectData: IProspect) => {
  const mainBorrower = getMainBorrower(prospectData.borrowers);

  const incomeData: IBorrowerIncomeData = {
    Leases: 0,
    Dividends: 0,
    FinancialIncome: 0,
    PeriodicSalary: 0,
    OtherNonSalaryEmoluments: 0,
    PensionAllowances: 0,
    ProfessionalFees: 0,
    PersonalBusinessUtilities: 0,
  };

  Object.keys(incomeData).forEach((incomeProperty) => {
    const property = mainBorrower?.borrowerProperties.find(
      (incomePropertyValue) =>
        incomePropertyValue.propertyName === incomeProperty,
    );
    if (property) {
      incomeData[incomeProperty as keyof IBorrowerIncomeData] =
        parseFloat(property.propertyValue) || 0;
    }
  });

  return incomeData;
};

export { IncomeCapital, IncomeEmployment, MicroBusinesses, getInitialValues };
