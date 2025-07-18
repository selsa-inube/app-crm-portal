import { IIncomeSources } from "@src/services/creditLimit/getIncomeSources/types";

export const mapCreditLimitEntity = (
  data: Record<string, string | number | object>,
): IIncomeSources => {
  const creditRequest: IIncomeSources = {
    Dividends: data.dividends as number,
    FinancialIncome: data.financialIncome as number,
    identificationNumber: data.identificationNumber as string,
    identificationType: data.identificationType as string,
    Leases: data.leases as number,
    name: data.name as string,
    OtherNonSalaryEmoluments: data.otherNonSalaryEmoluments as number,
    PensionAllowances: data.pensionAllowances as number,
    PeriodicSalary: data.periodicSalary as number,
    PersonalBusinessUtilities: data.personalBusinessUtilities as number,
    ProfessionalFees: data.professionalFees as number,
    surname: data.surname as string,
  };
  return creditRequest;
};
