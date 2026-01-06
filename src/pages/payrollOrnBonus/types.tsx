export const titleButtonTextAssited = {
  goBackText: "Anterior",
  goNextText: "Siguiente",
  submitText: "Enviar",
};
export interface IDisbursementGeneral {
  amount: number;
  Internal_account: IInternalAccount;
  External_account: IExternalAccount;
  Certified_check: IPersonData;
  Business_check: IPersonData;
  Cash: IPersonData;
}
interface IExternalAccount extends IPersonData {
  bank: string;
  accountType: string;
  accountNumber: string;
}
interface IInternalAccount extends IPersonData {
  accountNumber: string;
}
interface IPersonData {
  amount: number;
  check: boolean;
  toggle: boolean;
  accountLabel?: string;
  description: string;
  name: string;
  lastName: string;
  sex: string;
  documentType: string;
  identification: string;
  birthdate: string;
  phone: string;
  mail: string;
  city: string;
}
