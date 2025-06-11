interface iborrowerProperties {
  propertyName: string;
  propertyValue: string;
}

interface IBorrowers {
  borrowerIdentificationNumber: string;
  borrowerIdentificationType: string;
  borrowerProperties: iborrowerProperties[];
  borrowerType: string;
}

interface IconsolidatedCredits {
  borrowerIdentificationNumber: string;
  borrowerIdentificationType: string;
  consolidatedAmount: number;
  consolidatedAmountType: string;
  creditProductCode: string;
  lineOfCreditDescription: string;
}

interface IExtraordinaryInstallments {
  installmentAmount: number;
  installmentDate: string;
  paymentChannelAbbreviatedName: string;
}

export interface ISimulateCredit {
  borrowers: IBorrowers[];
  consolidatedCredits: IconsolidatedCredits[];
  linesOfCredit: [];
  extraordinaryInstallments: IExtraordinaryInstallments[];
  installmentLimit: number;
  moneyDestinationAbbreviatedName: string;
  preferredPaymentChannelAbbreviatedName: string;
  selectedRegularPaymentSchedule: string;
  requestedAmount: number;
  termLimit: number;
}
