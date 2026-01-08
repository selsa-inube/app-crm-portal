import { IBorrower } from "@services/prospect/types";
import { IDebtorDetail } from "@pages/applyForCredit/types";

export const dataExtraDebtors = {
  addBorrower: {
    code: "Add_borrower",
    description: "Button to add a new borrower",
    i18n: { en: "Add borrower", es: "Agregar deudor" },
  },
  add: {
    code: "Add",
    description: "Generic add button",
    i18n: { en: "Add", es: "Agregar" },
  },
  delete: {
    code: "Delete",
    description: "Confirmation text for deleting a borrower",
    i18n: {
      en: "Are you sure you want to delete this borrower?",
      es: "¿Realmente deseas eliminar este deudor?",
    },
  },
};

export enum EBorrowerProperty {
  Name = "name",
  Surname = "surname",
  Email = "email",
  PhoneNumber = "phone_number",
  BiologicalSex = "biological_sex",
  BirthDate = "birth_date",
  Relationship = "relationship",
  FinancialObligation = "FinancialObligation",
  PensionAllowances = "PensionAllowances",
  PeriodicSalary = "PeriodicSalary",
  PersonalBusinessUtilities = "PersonalBusinessUtilities",
  ProfessionalFees = "ProfessionalFees",
  Dividends = "Dividends",
  FinancialIncome = "FinancialIncome",
  Leases = "Leases",
  OtherNonSalaryEmoluments = "OtherNonSalaryEmoluments",
}

export enum EBorrowerType {
  Main = "MainBorrower",
}

export enum EFinancialObligationIndex {
  InstallmentAmount = 2,
}

export const GENDER_DISPLAY_MAP: Record<string, string> = {
  male: "Masculino",
  female: "Femenino",
};

export const GENDER_CODE_MAP: Record<string, string> = {
  M: "male",
  F: "female",
};

export const INCOME_PROPERTY_KEYS: string[] = [
  EBorrowerProperty.PensionAllowances,
  EBorrowerProperty.PeriodicSalary,
  EBorrowerProperty.PersonalBusinessUtilities,
  EBorrowerProperty.ProfessionalFees,
  EBorrowerProperty.Dividends,
  EBorrowerProperty.FinancialIncome,
  EBorrowerProperty.Leases,
  EBorrowerProperty.OtherNonSalaryEmoluments,
];

export const RelationshipType = {
  Holder: "Titular",
};

export const Delimiters = {
  Obligation: ",",
  Name: " ",
};

export interface ITransformedBorrower {
  id: string;
  name: string;
  lastName: string;
  email: string;
  income: string;
  obligations: string;
  borrowerType: string;
  debtorDetail: IDebtorDetail;
  originalData: IBorrower;
}
