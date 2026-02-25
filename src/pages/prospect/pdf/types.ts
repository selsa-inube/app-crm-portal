import jsPDF from "jspdf";

export interface INeutralShades {
  N0: string;
  N10: string;
  N20: string;
  N30: string;
  N40: string; // Used for borders
  N50: string;
  N60: string;
  N70: string;
  N80: string;
  N90: string;
  N100: string;
  N200: string;
  N300: string; // Used for Gray text
  N400: string;
  N500: string;
  N600: string;
  N700: string;
  N800: string;
  N900: string; // Used for Dark text
}

export interface IBlueShades {
  B50: string; // Used for Selected Background
  B75: string;
  B100: string;
  B200: string;
  B300: string; // Used for Selected Border
  B400: string; // Used for Primary Text
  B500: string;
}

export interface IRedShades {
  R400: string; // Used for Danger
}

export interface IGreenShades {
  G400: string;
}

export interface IYellowShades {
  Y400: string;
}

export interface IPalette {
  neutral: INeutralShades;
  blue: IBlueShades;
  red: IRedShades;
  green?: IGreenShades;
  yellow?: IYellowShades;
}

export interface ITheme {
  palette?: IPalette;
}

// --- Data Interfaces ---
export interface IHeaderData {
  destinationName: string;
  mainBorrowerName: string;
  totalLoanAmount: number;
}

// --- Component Props Interfaces ---
export interface IDrawFieldsetProps {
  doc: jsPDF;
  x: number;
  y: number;
  width: number;
  height: number;
  theme?: ITheme;
  isSelected?: boolean;
  borderColor?: "blue" | "gray" | "normal";
}

export interface IDrawTextProps {
  doc: jsPDF;
  text: string;
  x: number;
  y: number;
  theme?: ITheme;
  appearance?: "primary" | "dark" | "gray" | "danger" | "light";
  type?: "headline" | "title" | "body";
  size?: "large" | "medium" | "small";
  weight?: "normal" | "bold";
  align?: "left" | "center" | "right";
}

export interface CreditData {
  header: {
    destino: string;
    cliente: string;
    valorSolicitado: number;
  };
  cards: Array<{
    title: string;
    medioPago: string;
    montoPrestamo: number;
    tasaInteres: string;
    plazoMeses: string;
    cuotaPeriodica: number;
    cicloPagos: string;
  }>;
  footer: {
    montoProductos: number;
    obligaciones: number;
    gastos: number;
    netoGirar: number;
    cuotaOrdinaria: number;
  };
}

export interface ICardData {
  title: string;
  medioPago: string;
  montoPrestamo: number;
  tasaInteres: string;
  plazoMeses: string;
  cuotaPeriodica: number;
  cicloPagos: string;
}

export interface IFooterData {
  montoProductos: number;
  obligaciones: number;
  gastos: number;
  netoGirar: number;
  cuotaOrdinaria: number;
}

export interface ICreditData {
  header: IHeaderData;
  cards: ICardData[];
  footer: IFooterData;
  iconBase64?: string;
}
