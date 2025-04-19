import { IGeneralInformationEntry } from "./forms/GeneralInformationForm/types";

export interface IFormsUpdateData {
  personalInformation: { isValid: boolean; values: IGeneralInformationEntry };
}

export interface ModalState {
  isSendModalVisible: boolean;
  isRequestInfoModalVisible: boolean;
}
