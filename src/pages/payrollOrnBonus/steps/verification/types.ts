import { ReactNode } from "react";

export interface IAttributes {
  attribute: string;
  value: string;
}

export interface ISection {
  title: string;
  attributes: IAttributes[];
  stepNumber: number;
  customComponent?: ReactNode;
}

export interface IDataVerificationStep {
  sections: {
    [key: string]: ISection;
  };
}
export interface PersonalInfo {
  tipeOfDocument: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: string;
  age: string;
  relation: string;
}
export interface IPersonalInfoRequirement {
  requirementName: string;
  descriptionEvaluationRequirement: string;
}

export interface IPersonalInfo {
  requirements: IPersonalInfoRequirement[];
}

export interface IInternalAccount {
  amount: number;
  accountNumber: string;
  description: string;
  accountLabel?: string;
  bank?: string;
}

export interface IMethodOfDisbursement {
  Internal_account: IInternalAccount;
  External_account: IInternalAccount;
}

export interface IAdvanceType {
  type: string;
  description?: string;
}

export interface ISteps {
  personalInfo: IPersonalInfo;
  destinations: string;
  methodOfDisbursement: IMethodOfDisbursement;
  advanceType?: IAdvanceType;
}

export interface IControllerAccordionProps {
  steps: ISteps;
  setCurrentStep: (step: number) => void;
  destinationOfMoney: number;
  advanceType?: "payroll" | "bonus";
}
