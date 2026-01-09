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
