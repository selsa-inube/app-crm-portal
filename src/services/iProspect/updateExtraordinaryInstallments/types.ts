export interface IExtraordinaryInstallment {
  id?: string;
  installmentAmount: number;
  installmentDate: string;
  paymentChannelAbbreviatedName: string;
}
export interface IExtraordinaryInstallments {
  creditProductCode: string;
  extraordinaryInstallments: IExtraordinaryInstallment[];
  prospectId: string;
}
