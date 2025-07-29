import { Schedule, GracePeriodType, BorrowerProperties } from "@services/enums";

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

export interface IStaff {
  userId: string;
  userName: string;
  identificationType: string;
  identificationNumber: string;
  role: string;
}

export interface ICreditRequestPinned {
  creditRequestId: string;
  isPinned: string;
}

export interface IToDo {
  creditRequestId: string;
  creditRequestCode: string;
  CreditRequestStateId: string;
  creditRequestStateAbbreviatedName: string;
  stage: string;
  taskToBeDone: string;
  usersByCreditRequestResponse: IStaff[];
}

export interface IKeyRiskScoring {
  total_score: number;
  minimum_score: number;
  seniority: number;
  seniority_score: number;
  risk_center: number;
  risk_center_score: number;
  job_stability_index: number;
  job_stability_index_score: number;
  marital_status: string;
  marital_status_score: number;
  economic_activity: string;
  economic_activity_score: number;
}

export interface IRiskScoring {
  credit_request_id: string;
  risk_scoring: IKeyRiskScoring;
}

export type DmEtapasPrs =
  | "CUMPLIMIENTO_REQUISITOS"
  | "FORMALIZACION_GARANTIAS"
  | "GESTION_COMERCIAL"
  | "TRAMITADA"
  | "TRAMITE_DESEMBOLSO"
  | "VERIFICACION_APROBACION";

export type DmTareasPrs =
  | "ASESORAR_CLIENTE"
  | "CONFIRMAR_APROBACION"
  | "CONFIRMAR_DESEMBOLSO"
  | "GARANTIZAR_SOPORTES_POS"
  | "VALIDAR_REQUISITOS"
  | "VALIDAR_SOPORTES_JURIDICOS"
  | "INTERFACE_CARTERA";

export type DmConceptos =
  | "APROBAR_SOLICITUD"
  | "AUTOMATICA"
  | "GESTION_COMERCIAL"
  | "ANALISIS_RIESGO"
  | "RECHAZAR_SOLICITUD"
  | "SIN_CONCEPTO"
  | "APROBACION_HUMANA"
  | "RECHAZO_HUMANO";

export type DmDecisions =
  | "ANALISIS_RIESGO"
  | "ANULAR_SOLICITUD"
  | "APROBAR_SOLICITUD"
  | "CANCELAR_SOLICITUD"
  | "CONFIRMACION_CLIENTE"
  | "DESEMBOLSO_DECLINADO"
  | "DESEMBOLSO_REALIZADO"
  | "GESTION_COMERCIAL"
  | "RECHAZAR_SOLICITUD"
  | "SOPORTES_INVALIDOS"
  | "SOPORTES_POS_NO_RECIBIDOS"
  | "SOPORTES_POS_RECIBIDOS"
  | "SOPORTES_VALIDOS"
  | "VIABILIZAR_SOLICITUD"
  | "CREAR_OBLIGACIONES_DE_CARTERA"
  | "DECLINAR_OBLIGACIONES_DE_CARTERA";

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

export interface Ipayment_capacity {
  credit_request_id: string;
  payment_capacity: {
    available_value: number;
    base_income: number;
    percentage_used: number;
  };
}
export interface Icredit_behavior {
  credit_request_id: string;
  credit_behavior: {
    core_risk_score: number;
    central_risk_score_date: number;
    number_of_internal_arrears: number;
    maximum_number_of_installments_in_arrears: number;
  };
}

export interface Iuncovered_wallet {
  credit_request_id: string;
  uncovered_wallet: {
    overdraft_factor: number;
    discovered_value: number;
    reciprocity: number;
  };
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

export interface approval_by_credit_request_Mock {
  approval_id: string;
  credit_request_id: string;
  approver_id: string;
  approver_name: string;
  concept: string;
  error: boolean;
}

export interface Idocument {
  credit_request_id: string;
  document_id: string;
  document_managment_unique_reference: string;
  abbreviated_name: string;
}

export interface Ierror_issued {
  credit_request_id: string;
  error_issued_id: string;
  action_id: string;
  error_date: string;
  error_description: string;
  user_id: string;
  user_name: string;
  read: string;
}

export interface credit {
  credit_request_id: string;
  labor_stability: {
    company_seniority: number;
    labor_stability_index: number;
    max_labor_stability_index: number;
    estimated_severance: number;
  };
}

export interface IErrorService {
  id: string;
  message: string | Error;
}

export interface IProspect {
  prospect_code?: string;
  prospect_id: string;
  public_code?: string;
  state?: string;
  loan_amount?: number;
  installment_limit: number;
  term_limit?: number;
  timestamp?: string;
  selected_payment_schedule?: Schedule;
  selected_rate_type: string;
  payment_method?: string;
  grace_period: number;
  grace_period_type: (typeof GracePeriodType)[keyof typeof GracePeriodType];
  borrower?: IBorrower[];
  consolidated_credit?: IConsolidatedCredit[];
  credit_product?: ICreditProductProspect[] | unknown[];
  outlay: IOutlay[];
  borrowers?: unknown;
  requested_amount?: number;
  bond_value?: number;
  money_destination_abbreviated_name?: string;
  preferred_payment_channel_abbreviated_name?: string;
  time_of_creation?: string;
  consolidated_credits?: IConsolidatedCredit[];
  credit_products?: ICreditProductProspect[];
  selected_regular_payment_schedule?: string;
}

export interface ILineCredit {
  line_of_credit_id: string;
  line_of_credit_code: string;
  abbreviated_name: string;
  description_use: string;
  loan_amount_limit: number;
  loan_term_limit: number;
  interest_rate: number;
}

export interface IConsolidatedCredit {
  consolidated_amount: number;
  consolidated_amount_type: string;
  estimated_date_of_consolidation: string;
  credit_id?: string;
  line_of_credit_description: string;
  borrower_id?: string;
  consolidated_credit_schema?: string;
  monthly_salary?: number;
  other_monthly_payments?: number;
  pension_allowances?: number;
  leases?: number;
  dividends_or_shares?: number;
  financial_returns?: number;
  average_monthly_profit?: number;
  monthly_fees?: number;
  borrower_identification_number?: string;
  borrower_identification_type?: string;
  credit_product_code?: string;
}

export interface IExtraordinaryInstallment {
  installment_amount: number;
  installment_date: string;
  payment_channel_code: string;
}

export interface ICreditProductProspect {
  acquired_cash_flows: IAcquiredCashFlow[];
  abbreviated_name?: string;
  credit_product_code: string;
  extraordinary_installments: IExtraordinaryInstallment[];
  loan_amount: number;
  line_of_credit_code?: string;
  line_of_credit_abbreviated_name: string;
  interest_rate: number;
  installments_for_interest: IInstallmentsForInterest[];
  fixed_points: number;
  loan_term: number;
  schedule: Schedule;
  ordinary_installment_for_principal?: IOrdinaryInstallmentsForPrincipal;
  ordinary_installment_for_interest?: IInstallmentsForInterest;
  extraordinary_installment?: IExtraordinaryInstallment;
  acquired_cash_flow?: IAcquiredCashFlow;
}

interface IDebtor {
  id: string;
  label: string;
  value: string;
}

export interface IIncome {
  borrowers?: IDebtor[];
  borrower_id: string;
  borrower: string;
  capital: string[];
  employment: string[];
  businesses: string[];
}

export interface IBorrowerProperty {
  property_name: (typeof BorrowerProperties)[keyof typeof BorrowerProperties];
  property_value: string;
}

export interface IOutlay {
  abreviated_name?: string;
  date: string;
  amount: number;
}

export interface IBorrower {
  borrower_name: string;
  borrower_type: string;
  borrower_identification_type: string;
  borrower_identification_number: string;
  borrower_property?: IBorrowerProperty[];
  borrower_properties?: IBorrowerProperty[];
}

export interface IOrdinaryInstallmentsForPrincipal {
  term: number;
  number_of_installments: number;
  schedule: Schedule;
  installment_amount_for_capital: number;
  installment_amount: number;
  gradient_rate: number;
  gradient_value: number;
  gradient_schedule: string;
  first_gradient_date: string;
  payment_channel_code: string;
}

export interface IInstallmentsForInterest {
  schedule: Schedule;
  payment_channel_code: string;
}

export interface IAcquiredCashFlow {
  amount: string;
  date: string;
  payment_channel_unique_code: string;
  flow_number: number;
}

type ItemValidation = {
  [key: string]: "Y" | "N" | "";
};

export interface CreditRequest {
  credit_request_id: string;
  system_validations: ItemValidation;
  documentary_requirements: ItemValidation;
  human_validations: ItemValidation;
}

export interface IRiskScoringRangeRequered {
  seniority_score: number;
  risk_center_score: number;
  job_stability_index_score: number;
  marital_status_score: number;
  economic_activity_score: number;
}

export interface IExtraordinaryPayment {
  id: number | string;
  datePayment: string;
  amount?: number;
  value: number;
  paymentMethod: string;
  frequency?: string;
}
export interface IMoneyDestination {
  money_destination_id: string;
  money_destination_unique_reference: string;
  abbreviated_name: string;
  description_use: string;
  icon: string;
}

export interface IPaymentChannel {
  id: string;
  label: string;
  value: string;
}
export interface IDecisionsToDo {
  id: number | string;
  label: string;
  value: string;
}

export interface IMakeDecisionsCreditRequest {
  creditRequestId: string;
  humanDecision: string;
  justification: string;
}

export interface IUserSteps {
  id: number;
  intermediateSteps: number[];
}
export interface ILoanAmount {
  id: number;
  choice: string;
}
