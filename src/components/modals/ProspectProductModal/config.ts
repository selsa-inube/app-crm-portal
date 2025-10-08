import {
  CreditLine,
  PaymentMethod,
  AmortizationType,
  RateType,
} from "@services/enum/prospectProduct";
import { Schedule } from "@services/enum/schedule";

const creditLineOptions = [
  {
    id: CreditLine.Home,
    label: "Hogar",
    value: CreditLine.Home,
  },
  {
    id: CreditLine.Construction,
    label: "Construcción en lote",
    value: CreditLine.Construction,
  },
  {
    id: CreditLine.Investment,
    label: "Libre inversión",
    value: CreditLine.Investment,
  },
  {
    id: CreditLine.Dwelling,
    label: "Vivienda VIS",
    value: CreditLine.Dwelling,
  },
];

const paymentMethodOptions = [
  {
    id: PaymentMethod.MonthlyPayroll,
    label: "Nómina Mensual",
    value: PaymentMethod.MonthlyPayroll,
  },
  {
    id: PaymentMethod.BiweeklyPayroll,
    label: "Nómina Quincenal",
    value: PaymentMethod.BiweeklyPayroll,
  },
  {
    id: PaymentMethod.BankTransfer,
    label: "Transferencia Bancaria",
    value: PaymentMethod.BankTransfer,
  },
  {
    id: PaymentMethod.CreditCard,
    label: "Tarjeta de Crédito",
    value: PaymentMethod.CreditCard,
  },
  {
    id: PaymentMethod.DebitCard,
    label: "Tarjeta de Débito",
    value: PaymentMethod.DebitCard,
  },
  { id: PaymentMethod.Cash, label: "Efectivo", value: PaymentMethod.Cash },
  {
    id: PaymentMethod.MobilePayment,
    label: "Pago Móvil",
    value: PaymentMethod.MobilePayment,
  },
  { id: PaymentMethod.Check, label: "Cheque", value: PaymentMethod.Check },
];

const paymentCycleOptions = [
  { id: Schedule.Weekly, label: "Semanal", value: Schedule.Weekly },
  {
    id: Schedule.TenDayIntervals,
    label: "Cada 10 días",
    value: Schedule.TenDayIntervals,
  },
  { id: Schedule.Biweekly, label: "Quincenal", value: Schedule.Biweekly },
  { id: Schedule.Monthly, label: "Mensual", value: Schedule.Monthly },
  { id: Schedule.Bimonthly, label: "Bimestral", value: Schedule.Bimonthly },
  { id: Schedule.Quarterly, label: "Trimestral", value: Schedule.Quarterly },
  {
    id: Schedule.Semiannually,
    label: "Semestral",
    value: Schedule.Semiannually,
  },
  { id: Schedule.Annually, label: "Anual", value: Schedule.Annually },
];

const firstPaymentCycleOptions = [
  { id: "ciclo1", label: "15/09/2024", value: "ciclo1" },
  { id: "ciclo2", label: "15/10/2024", value: "ciclo2" },
];

const termInMonthsOptions = [
  { id: "12Months", label: "12", value: "12" },
  { id: "24Months", label: "24", value: "24" },
  { id: "48Months", label: "48", value: "48" },
];

const amortizationTypeOptions = [
  {
    id: AmortizationType.FixedPayments,
    label: "Abonos Fijos",
    value: AmortizationType.FixedPayments,
  },
  {
    id: AmortizationType.GradualPayments,
    label: "Pagos Graduales",
    value: AmortizationType.GradualPayments,
  },
  {
    id: AmortizationType.BulletPayment,
    label: "Pago Único (Bullet)",
    value: AmortizationType.BulletPayment,
  },
  {
    id: AmortizationType.BalloonPayment,
    label: "Pago Global (Balloon)",
    value: AmortizationType.BalloonPayment,
  },
  {
    id: AmortizationType.FixedPrincipal,
    label: "Capital Fijo",
    value: AmortizationType.FixedPrincipal,
  },
  {
    id: AmortizationType.InterestOnly,
    label: "Solo Intereses",
    value: AmortizationType.InterestOnly,
  },
  {
    id: AmortizationType.FixedIntegralPayments,
    label: "Abonos Fijos Integrales",
    value: AmortizationType.FixedIntegralPayments,
  },
];

const rateTypeOptions = [
  { id: RateType.Fixed, label: "Fija", value: RateType.Fixed },
  { id: RateType.Variable, label: "Variable", value: RateType.Variable },
  { id: RateType.Mixed, label: "Mixta", value: RateType.Mixed },
  { id: RateType.Adjustable, label: "Ajustable", value: RateType.Adjustable },
  { id: RateType.Floating, label: "Flotante", value: RateType.Floating },
];

export const messageNotFound = "No se encontraron resultados";

export const messagesErrorValidations = {
  loadPaymentOptions: "Error al cargar las opciones de pago",
  validateLoanAmount: "Error al validar el monto del crédito",
  validateLoanTermBusiness: "El plazo no cumple con las reglas de negocio",
  validateLoanTermRange: "El plazo debe estar dentro del rango permitido",
  validateLoanTermOther: "Error al validar el plazo",
  validateInterestRateBusiness: "La tasa no cumple con las reglas de negocio",
  validateInterestRateRange: "La tasa debe estar dentro del rango permitido",
  validateInterestRateOther: "Error al validar la tasa de interés",
};

export const VALIDATED_NUMBER_REGEX = /[^0-9]/g;

export const repaymentStructureMap: Record<string, string> = {
  "FixedInstallment": "Cuota integral fija",
  "ConstantAmortization": "Abonos fijos a capital",
  "GeometricGradientRepayment": "Gradiente geométrico",
  "ArithmeticGradientRepayment": "Gradiente aritmético",
};

export const interestRateTypeMap: Record<string, string> = {
  "VariableInterestRate": "Tasa variable",
  "FixedInterestRate": "Tasa fija",
};

export {
  creditLineOptions,
  paymentMethodOptions,
  paymentCycleOptions,
  firstPaymentCycleOptions,
  termInMonthsOptions,
  amortizationTypeOptions,
  rateTypeOptions,
};
