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
  noData: "No se han configurado cuotas extraordinarias.",
  deletion: "Eliminación",
  delete: "Eliminar",
  content: "¿Realmente desea eliminar este pago extra?",
  cancel: "Cancelar",
  titleSuccess: "Cambios guardados con éxito!",
  descriptionSuccess: `Hemos eliminado la Instalación extraordinaria exitosamente.`,
};

export const pageLength = 5;
