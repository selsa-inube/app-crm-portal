export type DmEtapasPrs =
  | "CUMPLIMIENTO_REQUISITOS"
  | "FORMALIZACION_GARANTIAS"
  | "GESTION_COMERCIAL"
  | "TRAMITADA"
  | "TRAMITE_DESEMBOLSO"
  | "VERIFICACION_APROBACION";

export interface IObligations {
  customerIdentificationNumber: string;
  customerIdentificationType: string;
  customerName: string;
  obligations: {
    balanceObligationTotal: number;
    duesPaid: number;
    entity: string;
    nextPaymentValueTotal: number;
    obligationNumber: string;
    outstandingDues: number;
    paymentMethodName: string;
    productName: string;
  }[];
}

export interface IUsersByCreditRequests {
  userId: string;
  userName: string;
  identificationType: string;
  identificationNumber: string;
  role: string;
}

export interface ICreditRequest {
  creditRequestId?: string;
  creditRequestCode: string;
  creditRequestDateOfCreation: string;
  loanAmount: number;
  clientId: string;
  moneyDestinationId: string;
  stage: DmEtapasPrs;
  moneyDestinationAbreviatedName: string;
  clientIdentificationNumber: string;
  clientName: string;
  taskToBeDone: string;
  unreadNovelties?: string;
  userWhoPinnnedId?: string;
  usersByCreditRequests?: IUsersByCreditRequests;
}

export interface IDocumentsCredit {
  abbreviatedName: string;
  creditRequestId: string;
  documentCode: string;
  documentId: string;
  fileName: string;
  transactionOperation: "Insert";
}

export interface IMortgagesCredit {
  descriptionUse: string;
  guaranteeId: string;
  mortgageId: string;
  propertyAge: number;
  propertyPrice: number;
  propertyType: string;
  transactionOperation: "Insert";
}

export interface IPledgesCredit {
  descriptionUse: string;
  guaranteeId: string;
  pledgeId: string;
  transactionOperation: "Insert";
  vehiculeAge: number;
  vehiculePrice: number;
}

export interface IGuaranteesCredit {
  creditRequestId: string;
  guaranteeId: string;
  guaranteeType: string;
  mortgages: IMortgagesCredit;
  pledges: IPledgesCredit;
  transactionOperation: "Insert";
}

export interface IModesOfDisbursementCredit {
  accountBankCode: string;
  accountBankName: string;
  accountNumber: string;
  accountType: string;
  creditRequestId: string;
  disbursementAmount: number;
  disbursementDate: string;
  disbursementReference: string;
  isInTheNameOfBorrower: string;
  modeOfDisbursementCode: string;
  modeOfDisbursementId: string;
  modeOfDisbursementType: string;
  observation: string;
  payeeBiologicalSex: string;
  payeeBirthday: string;
  payeeCityOfResidence: string;
  payeeEmail: string;
  payeeIdentificationNumber: string;
  payeeIdentificationType: string;
  payeeName: string;
  payeePersonType: string;
  payeePhoneNumber: string;
  payeeSurname: string;
  paymentOrderReference: string;
  transactionOperation: "Insert";
}

export interface ISubmitCredit {
  clientEmail: string;
  clientId: string;
  clientIdentificationNumber: string;
  clientIdentificationType: string;
  clientName: string;
  clientPhoneNumber: string;
  clientType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documents?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  guarantees: any;
  loanAmount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modesOfDisbursement: any;
  moneyDestinationAbreviatedName: string;
  moneyDestinationId: string;
  prospectId?: string;
  prospectCode: string;
}

export interface IPaymentChannel {
  id: string;
  label: string;
  value: string;
}
