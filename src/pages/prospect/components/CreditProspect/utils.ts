import { IIncomeSourceBorrowers } from "@src/services/prospect/totalIncomeByBorrowers/getTotalIncomeByBorrowerInProspect/types";
import { IIncomeSources } from "./types";

export const mapIncomeToCreditLimit = (
  incomeData: IIncomeSourceBorrowers,
): IIncomeSources => {
  const income: IIncomeSources = {
    name: "",
    surname: "",
    identificationNumber: "",
    identificationType: "",
    Dividends: 0,
    FinancialIncome: 0,
    Leases: 0,
    OtherNonSalaryEmoluments: 0,
    PensionAllowances: 0,
    PeriodicSalary: 0,
    PersonalBusinessUtilities: 0,
    ProfessionalFees: 0,
  };

  income.name = incomeData.borrowerIdentificationNumber;
  income.surname = incomeData.borrowerIdentificationNumber;
  income.identificationNumber = incomeData.borrowerIdentificationNumber;
  income.identificationType = incomeData.borrowerIdentificationNumber;

  incomeData.income.forEach((incomeDetail) => {
    (income[incomeDetail.incomeType as keyof IIncomeSources] as number) =
      incomeDetail.incomeValue;
  });

  return income;
};

export const filterIncomeByBorrower = (
  incomes: IIncomeSourceBorrowers[],
  publicCode: string,
): IIncomeSources => {
  const income = incomes.find(
    (income) => income.borrowerIdentificationNumber === publicCode,
  );

  return mapIncomeToCreditLimit(income!);
};
