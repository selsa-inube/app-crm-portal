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
  FixedInstallment: "Cuota integral fija",
  ConstantAmortization: "Abonos fijos a capital",
  GeometricGradientRepayment: "Gradiente geométrico",
  ArithmeticGradientRepayment: "Gradiente aritmético",
  ValueIncrementPayments: "Pagos valor de incremento",
  PercentageIncrementPayments: "Pagos con porcentaje de incremento",
};

export const interestRateTypeMap: Record<string, string> = {
  VariableInterestRate: "Tasa variable",
  FixedInterestRate: "Tasa fija",
};

export const fieldLabels = {
  creditAmount: "Monto del crédito",
  termInMonths: "Plazo en meses",
  amortizationType: "Tipo de amortización",
  incrementValue: "Valor de incremento",
  incrementPercentage: "Porcentaje de incremento",
  interestRate: "Tasa de interés",
  rateType: "Tipo de tasa",
  paymentMethod: "Método de pago",
  paymentCycle: "Ciclo de pago",
  firstPaymentCycle: "Primer ciclo de pago",
  creditLine: "Línea de crédito",
  ordinaryPayment: "Cuota ordinaria mensual",
};

export const fieldPlaceholders = {
  incrementValue: "Ej: 50000",
  incrementPercentage: "Ej: 5",
  creditAmount: "Ingrese el monto",
  interestRate: "Ingrese la tasa",
};

export const validationMessages = {
  incrementRequired: "El valor de incremento es requerido",
  incrementMustBePositive: "El valor debe ser mayor a 0",
  incrementValidating: "Validando...",
  incrementValueRange: (min: number, max: number) =>
    `El valor debe estar entre $${min.toLocaleString()} y $${max.toLocaleString()}`,
  incrementPercentageRange: (min: number, max: number) =>
    `El porcentaje debe estar entre ${min}% y ${max}%`,
  incrementValidationError: "Error al validar el incremento",
  loanAmountOutOfRange: (amount: number, min: number, max: number) =>
    `El monto ingresado es $${amount.toLocaleString()}. Debe estar entre $${min.toLocaleString()} y $${max.toLocaleString()}`,
  loanAmountExceedsMax: (amount: number, max: number) =>
    `El monto ingresado es $${amount.toLocaleString()}. El máximo permitido es $${max.toLocaleString()}`,
  loanAmountValidationFailed: "No se pudo validar el monto del crédito",
  loanAmountValidationError: "Error al validar el monto del crédito",
  loanTermOutOfRange: (term: number, min: number, max: number) =>
    `El plazo ingresado es ${term} meses. Debe estar entre ${min} y ${max} meses`,
  loanTermValidationFailed: "No se pudo validar el plazo",
  loanTermValidationError: "Error al validar el plazo",
  interestRateOutOfRange: (rate: number, min: number, max: number) =>
    `La tasa ingresada es ${rate}% mensual. Debe estar entre ${min.toFixed(2)}% y ${max.toFixed(2)}% mensual`,
  interestRateValidationError: "Error al validar la tasa de interés",
};

export const flagMessages = {
  changesSavedTitle: "Cambios guardados",
  changesSavedDescription:
    "Los cambios en el producto se han guardado correctamente",
  saveErrorTitle: "Error al guardar cambios",
  saveErrorDescription:
    "No se pudieron guardar los cambios. Por favor, intenta nuevamente.",
  validateIncrementErrorTitle: "Error al validar incremento",
  validateIncrementErrorDescription: "Error al validar el incremento",
  validateAmountErrorTitle: "Error al validar monto",
  validateAmountErrorDescription:
    "Error del servidor al validar el monto del crédito",
  validateTermErrorTitle: "Error al validar plazo",
  validateTermErrorDescription: "Error al validar el plazo",
  validateRateErrorTitle: "Error al validar tasa",
  validateRateErrorDescription: "Error al validar la tasa de interés",
};

export const errorModalMessages = {
  saveChangesError: "No se pudieron guardar los cambios",
  updateViewError: "Error actualizando vista",
};

export const REPAYMENT_STRUCTURES_WITH_INCREMENT = {
  VALUE_INCREMENT: "Pagos valor de incremento",
  PERCENTAGE_INCREMENT: "Pagos con porcentaje de incremento",
} as const;

export const DEBOUNCE_DELAY = 500;

export const FLAG_DURATION = 5000;

export {
  creditLineOptions,
  paymentMethodOptions,
  paymentCycleOptions,
  firstPaymentCycleOptions,
  termInMonthsOptions,
  amortizationTypeOptions,
  rateTypeOptions,
};
