import jsPDF from "jspdf";

export interface INeutralShades {
  N0: string;
  N10: string;
  N20: string;
  N30: string;
  N40: string;
  N50: string;
  N60: string;
  N70: string;
  N80: string;
  N90: string;
  N100: string;
  N200: string;
  N300: string;
  N400: string;
  N500: string;
  N600: string;
  N700: string;
  N800: string;
  N900: string;
}

export interface IBlueShades {
  B50: string;
  B75: string;
  B100: string;
  B200: string;
  B300: string;
  B400: string;
  B500: string;
}

export interface IRedShades {
  R400: string;
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

export interface IHeaderData {
  destinationName: string;
  mainBorrowerName: string;
  totalLoanAmount: number;
}

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
  boldThickness?: number;
}
export interface ICardData {
  title: string;
  paymentMethod: string;
  loanAmount: number;
  interestRate: string;
  termMonths: string;
  periodicPayment: number;
  paymentCycle: string;
}

export interface IFooterData {
  productsAmount: string;
  obligations: string;
  expenses: string;
  netToDisburse: string;
  ordinaryInstallment: string;
}

export interface ICreditData {
  header: IHeaderData;
  cards: ICardData[];
  footer: IFooterData;
  iconBase64?: string;
}
export interface ILayoutConfig {
  PageWidth: number;
  PageHeight: number;
  MarginX: number;
  StartY: number;
  ContentWidth: number;
}
