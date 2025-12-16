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
