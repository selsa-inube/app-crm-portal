export interface IDataInformationItem {
  balance?: number;
  fee?: number;
  propertyValue?: string | string[];
  propertyName?: string;
}

export interface IProperty {
  propertyName: string;
  propertyValue: string;
}

export interface IObligations {
  balanceObligationTotal: number;
  duesPaid: number;
  entity: string;
  nextPaymentValueTotal: number;
  obligationNumber: string;
  outstandingDues: number;
  paymentMethodName: string;
  productName: string;
}

export interface IBorrowerDataFinancial {
  borrowerName: string;
  borrowerType: string;
  borrowerIdentificationType: string;
  borrowerIdentificationNumber: string;
}
