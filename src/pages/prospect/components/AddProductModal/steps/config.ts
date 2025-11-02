import * as Yup from "yup";

import {
  IPaymentMethod,
  IPaymentCycle,
} from "@services/prospect/getPaymentMethods/types";

export interface IFirstPaymentDate {
  id: string;
  value: string;
  label: string;
}

export interface IPaymentConfiguration {
  paymentMethod: string;
  paymentCycle: string;
  firstPaymentDate: string;
  availablePaymentMethods: IPaymentMethod[];
  availablePaymentCycles: IPaymentCycle[];
  availableFirstPaymentDates: IFirstPaymentDate[];
}

export const VALIDATED_NUMBER_REGEX = /[^0-9]/g;

export interface ITermSelectionValues {
  toggles: {
    quotaCapToggle: boolean;
    maximumTermToggle: boolean;
  };
  quotaCapValue: string | number;
  maximumTermValue: string | number;
}

export interface ITermSelection {
  quotaCapValue: number;
  maximumTermValue: number;
  quotaCapEnabled: boolean;
  maximumTermEnabled: boolean;
  isMobile: boolean;
  onChange: (values: {
    quotaCapValue: number;
    maximumTermValue: number;
    quotaCapEnabled: boolean;
    maximumTermEnabled: boolean;
  }) => void;
  onFormValid: (isValid: boolean) => void;
}

export interface ITermSelectionUI {
  isMobile: boolean;
  initialValues: ITermSelectionValuesMain;
  validationSchema: Yup.ObjectSchema<{
    quotaCapValue?: string;
    maximumTermValue?: string;
  }>;
  handleValidationsForm: (values: ITermSelectionValuesMain) => void;
  handleQuotaCapToggleChange: (
    isChecked: boolean,
    setFieldValue: (field: string, value: string | number | boolean) => void,
    values: ITermSelectionValuesMain,
  ) => void;
  handleQuotaCapValueChange: (
    rawValue: string,
    setFieldValue: (field: string, value: string | number) => void,
  ) => void;
  handleMaximumTermToggleChange: (
    isChecked: boolean,
    setFieldValue: (field: string, value: string | number | boolean) => void,
    values: ITermSelectionValuesMain,
  ) => void;
  handleMaximumTermValueChange: (
    numericValue: number,
    setFieldValue: (field: string, value: string | number) => void,
  ) => void;
}

export interface ITermSelectionValuesMain {
  toggles: {
    quotaCapToggle: boolean;
    maximumTermToggle: boolean;
  };
  quotaCapValue: string | number;
  maximumTermValue: string | number;
}

export interface IPaymentConfigurationUI {
  paymentConfig: IPaymentConfiguration;
  paymentConfiguration: {
    paymentMethod: {
      label: string;
      placeholder: string;
    };
    paymentCycle: {
      label: string;
    };
    firstPaymentDate: {
      label: string;
      placeholder: string;
    };
  };
  handlePaymentMethodChange: (value: string) => void;
  handlePaymentCycleChange: (value: string) => void;
  handleFirstPaymentDateChange: (value: string) => void;
}

export interface IPaymentConfigurationMain {
  paymentConfig: IPaymentConfiguration;
  onChange: (config: Partial<IPaymentConfiguration>) => void;
  onFormValid: (isValid: boolean) => void;
}

export interface IAmountCaptureProps {
  creditLine: string;
  amount: number;
  moneyDestination: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  onChange: (amount: number) => void;
  onFormValid: (isValid: boolean) => void;
}

export interface IAmountCaptureUI {
  displayValue: string;
  loanAmountError: string;
  amountCaptureTexts: typeof amountCaptureTexts;
  handleCurrencyChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const amountCaptureTexts = {
  label: "Monto del crédito",
  placeholder: "Ej. 500.000",
  errors: {
    zeroAmount: "El monto debe ser mayor a cero",
    rangeAmount: (from: number, to: number) =>
      `El monto debe estar entre ${from.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      })} y ${to.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      })}`,
    maxAmount: (max: number) =>
      `El monto máximo permitido es ${max.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      })}`,
    validationFailed: "No se pudo validar el monto con las reglas de negocio",
    validationError: "Error al validar el monto del crédito",
  },
};

export const loanData = {
  quotaCapTitle: "¿Deseas establecer un tope de cuota?",
  quotaCapLabel: "Valor máximo de la cuota",
  quotaCapPlaceholder: "$0",
  maximumTermTitle: "¿Deseas establecer un plazo máximo?",
  maximumTermLabel: "Plazo en meses",
  maximumTermPlaceholder: "0",
  yes: "Sí",
  no: "No",
};

export const paymentConfiguration = {
  paymentMethod: {
    placeholder: "Selecciona una opcion",
    label: "Medio de pago",
  },
  paymentCycle: {
    placeholder: "Selecciona una opcion",
    label: "Ciclo de pagos",
  },
  firstPaymentDate: {
    placeholder: "Selecciona una opcion",
    label: "Primer ciclo de pago",
  },
};
