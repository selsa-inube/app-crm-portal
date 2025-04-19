import { IHolidaysTable } from "./types";

export const columns = [
  { span: 1, style: { width: "auto" } },
  { span: 1, style: { width: "auto" } },
  { span: 1, style: { width: "auto" } },
  { span: 1, style: { width: "auto" } },
  { span: 1, style: { width: "70px" } },
  { span: 1, style: { width: "80px" } },
];

interface ExtendedIHolidaysTable extends IHolidaysTable {
  mobileActions?: { value: JSX.Element };
  type?: { value: string };
}

export const headers: {
  label: string;
  key: keyof ExtendedIHolidaysTable;
  action?: boolean;
  style?: React.CSSProperties;
}[] = [
  { label: "Descripción", key: "description", style: { width: "auto" } },
  { label: "Fecha", key: "date", style: { width: "auto" } },
  { label: "Días hábiles", key: "days", style: { width: "auto" } },
  { label: "Estado", key: "status", style: { width: "auto" } },
  {
    label: "Detalles",
    key: "details",
    action: true,
    style: { width: "60px" },
  },
  { label: "Eliminar", key: "delete", action: true, style: { width: "60px" } },
];

export const pageLength = 5;
export const caption = "Tabla de Ejemplo";
