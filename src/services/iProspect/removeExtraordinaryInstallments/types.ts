export interface IExtraordinaryInstallment {
  installmentAmount: number;
  installmentDate: string;
  paymentChannelAbbreviatedName: string;
}
export interface IExtraordinaryInstallments {
  creditProductCode: string;
  extraordinaryInstallments: IExtraordinaryInstallment[];
  prospectId: string;
}
