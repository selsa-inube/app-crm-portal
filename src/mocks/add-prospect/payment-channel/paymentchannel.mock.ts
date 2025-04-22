import { IPaymentChannel } from "@services/types";

export const mockPaymentChannel: IPaymentChannel[] = [
  { id: "1", label: "Nomina Colpensiones", value: "nomina-colpensiones" },
  {
    id: "2",
    label: "Canales de recaudo individual(CRI)",
    value: "canales-de-recaudo-individual-cri",
  },
  {
    id: "3",
    label: "Débito automático interno",
    value: "débito-automático-interno",
  },
  {
    id: "4",
    label: "Débito automático en bancos",
    value: "débito-automático-en-bancos",
  },
];

export const mockPeriodicity = [
  {
    id: "1",
    label: "Mensual pagado en día 30",
    value: "mensual-pagado-en-día-30",
  },
  {
    id: "2",
    label: "Mensual pagado en día 15",
    value: "mensual-pagado-en-día-15",
  },
];

export const mockPayAmount = [
  { id: "1", label: "15/Dic/2024", value: "15/Dic/2024" },
  { id: "2", label: "30/Dic/2024", value: "30/Dic/2024" },
];
