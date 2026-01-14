import { currencyFormat } from "@utils/formatData/currency";
import { IHeaders } from "@components/modals/ExtraordinaryPaymentModal/types";

export const rowsVisbleMobile = ["datePayment", "value", "actions"];

export const rowsActions = [{ label: "Acciones", key: "actions" }];

export const headersTableExtraordinaryInstallment: IHeaders[] = [
  { label: "Fecha", key: "datePayment" },
  {
    label: "Valor",
    key: "value",
    mask: (value: string | number) => {
      return currencyFormat(value as number);
    },
  },
  { label: "Medio de pago", key: "paymentMethod" },
];

export const dataTableExtraordinaryInstallment = {
  noData: {
    code: "No_data",
    description:
      "Message shown when no extraordinary installments are configured",
    i18n: {
      en: "No extraordinary installments configured.",
      es: "No se han configurado cuotas extraordinarias.",
    },
  },
  deletion: {
    code: "Deletion",
    description: "Title shown for deletion actions",
    i18n: {
      en: "Deletion",
      es: "Eliminación",
    },
  },
  delete: {
    code: "Delete",
    description: "Text for delete button",
    i18n: {
      en: "Delete",
      es: "Eliminar",
    },
  },
  content: {
    code: "Delete_confirm",
    description:
      "Confirmation message for deleting an extraordinary installment",
    i18n: {
      en: "Are you sure you want to delete this extra payment?",
      es: "¿Realmente deseas eliminar este pago extra?",
    },
  },
  cancel: {
    code: "Cancel",
    description: "Cancel button text",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },
  titleSuccess: {
    code: "Success_title",
    description: "Title shown when an action is successfully completed",
    i18n: {
      en: "Changes saved successfully!",
      es: "Cambios guardados con éxito!",
    },
  },
  descriptionSuccess: {
    code: "Success_description",
    description:
      "Description shown when an extraordinary installment is deleted successfully",
    i18n: {
      en: "The extraordinary installment has been successfully deleted.",
      es: "Hemos eliminado la Instalación extraordinaria exitosamente.",
    },
  },
};

export const pageLength = 5;
