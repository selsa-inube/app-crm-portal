import { IProspect } from "../prospect/types";
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
export interface IValidateRequirement {
  borrowerName: string;
  documentalRequirement: string[];
}
export interface IPatchValidateRequirementsPayload {
  prospect: IProspect;
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
  transactionOperation: "Insert";
  creditRequestId?: string;
  documentCode?: string;
  documentId?: string;
  fileName?: string;
  requirementReference?: string;
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
export interface IExtraordinaryInstallments {
  humanChannelPaymentDay: number;
  installmentAmount: number;
  installmentDate: string;
  paymentChannelAbbreviatedName: string;
}
export interface IMaximumCreditLimit {
  customerCode: string;
  dividends: number;
  financialIncome: number;
  leases: number;
  lineOfCreditAbbreviatedName: string;
  moneyDestination: string;
  otherNonSalaryEmoluments: number;
  pensionAllowances: number;
  periodicSalary: number;
  personalBusinessUtilities: number;
  professionalFees: number;
  basicLivingExpenseReserve?: number;
  extraordinaryInstallments?: IExtraordinaryInstallments[];
  maxAmount?: number;
  maxTerm?: number;
  maximumCreditLimitValue?: number;
  paymentCapacity?: number;
  totalIncomeReportedSources?: number;
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
  documents?: IDocumentsCredit[];
  guarantees: IGuaranteesCredit[];
  loanAmount: number;
  modesOfDisbursement: IModesOfDisbursementCredit[];
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

export type CreditRequestParams = {
  creditRequestCode?: string;
  clientIdentificationNumber?: string;
  textInSearch?: string;
};
