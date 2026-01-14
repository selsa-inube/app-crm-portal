export interface IFinancialObligation {
  type: string;
  balance: number;
  fee: number;
  entity: string;
  payment: string;
  feePaid: string;
  actions: string;
  id: string;
  idUser: string;
}

export const headers: {
  label: {
    code: string;
    description: string;
    i18n: {
      en: string;
      es: string;
    };
  };
  key: keyof IFinancialObligation;
  action?: boolean;
}[] = [
  {
    key: "type",
    label: {
      code: "Obligation_type_header",
      description: "Obligation type column",
      i18n: {
        en: "Type",
        es: "Tipo",
      },
    },
  },
  {
    key: "balance",
    label: {
      code: "Balance_header",
      description: "Balance column",
      i18n: {
        en: "Balance",
        es: "Saldo",
      },
    },
  },
  {
    key: "fee",
    label: {
      code: "Fee_header",
      description: "Fee column",
      i18n: {
        en: "Installment",
        es: "Cuota",
      },
    },
  },
  {
    key: "entity",
    label: {
      code: "Entity_header",
      description: "Entity column",
      i18n: {
        en: "Entity",
        es: "Entidad",
      },
    },
  },
  {
    key: "payment",
    label: {
      code: "Payment_method_header",
      description: "Payment channel column",
      i18n: {
        en: "Payment channel",
        es: "Medio de pago",
      },
    },
  },
  {
    key: "idUser",
    label: {
      code: "User_id_header",
      description: "User identifier column",
      i18n: {
        en: "Id",
        es: "Id",
      },
    },
  },
  {
    key: "feePaid",
    label: {
      code: "Fee_paid_header",
      description: "Paid installments column",
      i18n: {
        en: "Paid installments",
        es: "Altura",
      },
    },
  },
  {
    key: "actions",
    action: true,
    label: {
      code: "Actions_header",
      description: "Actions column",
      i18n: {
        en: "Actions",
        es: "Acciones",
      },
    },
  },
];

export const dataReport = {
  title: {
    code: "Financial_obligations_title",
    description: "Financial obligations title",
    i18n: {
      en: "Financial obligations",
      es: "Obligaciones financieras",
    },
  },

  close: {
    code: "Close_action",
    description: "Close action",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },

  addObligations: {
    code: "Add_obligations_action",
    description: "Add financial obligations",
    i18n: {
      en: "Add obligations",
      es: "Agregar obligaciones",
    },
  },

  noData: {
    code: "No_financial_obligations",
    description: "No financial obligations found",
    i18n: {
      en: "Oops! No current financial obligations were found.",
      es: "¡Ups! No se encontraron obligaciones financieras vigentes.",
    },
  },

  totalFee: {
    code: "Total_fee",
    description: "Total installment amount",
    i18n: {
      en: "Total loan amount",
      es: "Cuota Total",
    },
  },

  totalBalance: {
    code: "Total_balance",
    description: "Total balance amount",
    i18n: {
      en: "Total balance",
      es: "Saldo Total",
    },
  },
};
