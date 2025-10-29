import { IStaff } from "@mocks/staff/types";
import { IBorrower, IProspect } from "../prospect/types";
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
  stage?: string;
};

export interface ICreditRequests {
  creditRequestId: string;
  creditRequestCode?: string;
  executed_task?: string;
  execution_date?: string;
  identificationNumber?: string;
  identificationType?: string;
  justification?: string;
  role?: string;
  transactionOperation?: string;
  userId?: string;
  userName?: string;
  staffName?: string;
}

export interface IUnreadErrors {
  creditRequestId: string;
}

export interface IUnreadErrorsResponse {
  actionId: string;
  creditRequestId: string;
  errorDate: string;
  errorDescription: string;
  errorIssuedId: string;
  errorRead: string;
  transactionOperation: "Insert";
  userId: string;
}

export interface INotificationOnApprovals {
  approvalId: string;
  creditRequestId: string;
}
export interface INotificationOnApprovalsResponse {
  codeNotification: string;
}

export interface IPayrollDiscountAuthorization {
  creditRequestId: string;
  payrollDiscountAuthorizationId: string;
  payrollDiscountAuthorizationCode: string;
  descriptionUse: string;
  abbreviatedName: string;
  borrowerId: string;
  borrowerName: string;
  documentState: string;
  obligationCode: string;
  documentCode: string;
  imageCode: string;
  borrowerIdentificationType: string;
  borrowerIdentificationNumber: string;
}

export interface IPromissoryNotes {
  creditRequestId: string;
  promissory_note_id: string;
  promissory_note_code: string;
  descriptionUse: string;
  abbreviatedName: string;
  CreditProductId: string;
  documentState: string;
  obligationCode: string;
  documentCode: string;
  imageCode: string;
  BorrowersByPromissoryNotes: IBorrower[];
  TransactionOperation: string;
  payrollDiscountAuthorizationId: string;
}

export interface ITraceType {
  traceValue: string;
  executionDate: string;
  traceType: string;
  creditRequestId?: string;
  userName?: string;
  userId?: string;
  traceId?: string;
  useCase?: string;
  justification?: string;
  decisionTakenByUser?: string;
  decision_of_concept?: string;
  readNovelty?: string;
}

export interface IAccountingVouchers {
  documentCode: string;
  obligationCode: string;
  accountingReference?: string;
  id: string;
  creditRequestId?: string;
  payrollDiscountAuthorizationCode?: string;
  promissoryNoteCode?: string;
}

export interface IModeOfDisbursement {
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
}

export interface IToDo {
  creditRequestId: string;
  creditRequestCode: string;
  CreditRequestStateId: string;
  creditRequestStateAbbreviatedName: string;
  stage: string;
  taskToBeDone: string;
  usersByCreditRequestResponse: IStaff[];
  prospectId: string;
}
