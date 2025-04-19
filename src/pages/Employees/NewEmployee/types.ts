import { AlertCardProps } from "@components/data/AlertCard";

import { IPersonalDataEntry } from "./forms/PersonalDataForm/types";
import { IContractualPositionData } from "./forms/ContractualPositionDataForm/types";
import { ILegalAccountingLocation } from "./forms/LegalAccountingLocationForm/types";

export interface IFormsUpdateData {
  personalInformation: { isValid: boolean; values: IPersonalDataEntry };
  contractualPositionData: {
    isValid: boolean;
    values: IContractualPositionData;
  };
  legalAccountingLocation: {
    isValid: boolean;
    values: ILegalAccountingLocation;
  };
  assignmentForm: {
    isValid: boolean;
    values: IAssignment[];
  };
  unmetRequirements: {
    isValid: boolean;
    values: AlertCardProps[];
  };
}

export interface ModalState {
  isSendModalVisible: boolean;
  isRequestInfoModalVisible: boolean;
}

export interface IAssignment {
  title: string;
  assignment: string;
  value: string;
}
