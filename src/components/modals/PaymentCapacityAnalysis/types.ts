import { EnumType } from "@hooks/useEnum/useEnum";

export interface IFieldItem {
  label: string;
  value: string | number;
  showIcon?: boolean;
  onShowModal?: () => void;
}

export interface IFieldsetData {
  legend: string;
  items: IFieldItem[];
}

export interface ISummaryItem {
  label: string;
  value: string | number;
  bold?: boolean;
  gray?: boolean;
  showIcon?: boolean;
  onShowModal?: () => void;
}

export interface IValueWithIcon {
  value: string | number;
  showIcon?: boolean;
  isMobile: boolean;
  onShowModal?: () => void;
}

export interface IFieldsetSection {
  legend: string;
  items: IFieldItem[];
  isMobile: boolean;
  lang: EnumType;
}

export interface ISummarySection {
  items: ISummaryItem[];
  isMobile: boolean;
  showIcon?: boolean;
}

export interface IFieldsetItem {
  label: string;
  value: string;
  showIcon?: boolean;
  onShowModal?: () => void;
}
