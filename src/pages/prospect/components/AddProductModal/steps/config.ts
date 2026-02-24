import * as Yup from "yup";

import { IResponsePaymentDatesChannel } from "@services/payment-channels/SearchAllPaymentChannelsByIdentificationNumber/types";
import { EnumType } from "@hooks/useEnum/useEnum";
import { IProspect } from "@services/prospect/types";
import { ICRMPortalData } from "@context/AppContext/types";
import { CreditLineGeneralTerms } from "@services/lineOfCredit/types";

export interface IFirstPaymentDate {
  id: string;
  value: string;
  label: string;
}

export interface IPaymentConfiguration {
  paymentMethod: string;
  paymentCycle: string;
  firstPaymentDate: string;
  paymentChannelData: IResponsePaymentDatesChannel[];
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
  lang: EnumType;
  isMobile: boolean;
  dataProspect: IProspect;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  eventData: ICRMPortalData;
  onChange: (values: {
    quotaCapValue: number;
    maximumTermValue: number;
    quotaCapEnabled: boolean;
    maximumTermEnabled: boolean;
  }) => void;
  onFormValid: (isValid: boolean) => void;
  generalTerms: CreditLineGeneralTerms | null;
}

export interface ITermSelectionUI {
  isMobile: boolean;
  lang: EnumType;
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

export interface IPaymentsOptions {
  id: string;
  value: string;
  label: string;
}

export interface IPaymentConfigurationUI {
  paymentConfig: IPaymentConfiguration;
  paymentMethodOptions: IPaymentsOptions[];
  paymentCycleOptions: IPaymentsOptions[];
  firstPaymentDateOptions: IPaymentsOptions[];
  lang: EnumType;
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
  hasOnlyOnePaymentMethod: boolean;
  hasOnlyOnePaymentCycle: boolean;
  hasOnlyOneFirstPaymentDate: boolean;
}

export interface IPaymentConfigurationMain {
  paymentConfig: IPaymentConfiguration;
  lang: EnumType;
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
  generalTerms: CreditLineGeneralTerms | null;
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
  quotaCapTitle: {
    code: "Loan_QuotaCapTitle",
    description: "Title asking if the user wants to set a quota cap",
    i18n: {
      en: "Do you want to set a quota cap?",
      es: "¿Deseas establecer un tope de cuota?",
    },
  },
  quotaCapLabel: {
    code: "Loan_QuotaCapLabel",
    description: "Label for the maximum quota input",
    i18n: {
      en: "Maximum quota value",
      es: "Valor máximo de la cuota",
    },
  },
  quotaCapPlaceholder: {
    code: "Loan_QuotaCapPlaceholder",
    description: "Placeholder for maximum quota input",
    i18n: {
      en: "$0",
      es: "$0",
    },
  },
  maximumTermTitle: {
    code: "Loan_MaximumTermTitle",
    description: "Title asking if the user wants to set a maximum term",
    i18n: {
      en: "Do you want to set a maximum term?",
      es: "¿Deseas establecer un plazo máximo?",
    },
  },
  maximumTermLabel: {
    code: "Loan_MaximumTermLabel",
    description: "Label for maximum term input",
    i18n: {
      en: "Term in months",
      es: "Plazo en meses",
    },
  },
  maximumTermPlaceholder: {
    code: "Loan_MaximumTermPlaceholder",
    description: "Placeholder for maximum term input",
    i18n: {
      en: "0",
      es: "0",
    },
  },
  yes: {
    code: "Loan_Yes",
    description: "Yes option label",
    i18n: {
      en: "Yes",
      es: "Sí",
    },
  },
  no: {
    code: "Loan_No",
    description: "No option label",
    i18n: {
      en: "No",
      es: "No",
    },
  },
};

export const paymentConfiguration = {
  paymentMethod: {
    placeholder: {
      code: "PaymentMethod_Placeholder",
      description: "Placeholder for payment channel selection",
      i18n: {
        en: "Select an option",
        es: "Selecciona una opción",
      },
    },
    label: {
      code: "PaymentMethod_Label",
      description: "Label for payment channel input",
      i18n: {
        en: "Payment channel",
        es: "Medio de pago",
      },
    },
  },
  paymentCycle: {
    placeholder: {
      code: "PaymentCycle_Placeholder",
      description: "Placeholder for payment cycle selection",
      i18n: {
        en: "Select an option",
        es: "Selecciona una opción",
      },
    },
    label: {
      code: "PaymentCycle_Label",
      description: "Label for payment cycle input",
      i18n: {
        en: "Payment cycle",
        es: "Ciclo de pagos",
      },
    },
  },
  firstPaymentDate: {
    placeholder: {
      code: "FirstPaymentDate_Placeholder",
      description: "Placeholder for first payment date selection",
      i18n: {
        en: "Select an option",
        es: "Selecciona una opción",
      },
    },
    label: {
      code: "FirstPaymentDate_Label",
      description: "Label for first payment date input",
      i18n: {
        en: "First payment date",
        es: "Primer ciclo de pago",
      },
    },
  },
};
