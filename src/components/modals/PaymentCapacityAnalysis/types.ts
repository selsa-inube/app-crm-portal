export interface IFieldItem {
  label: string;
  value: string;
  showIcon?: boolean;
}

export interface IFieldsetData {
  legend: string;
  items: IFieldItem[];
}

export interface ISummaryItem {
  label: string;
  value: string;
  bold?: boolean;
  gray?: boolean;
  showIcon?: boolean;
}

export interface IValueWithIcon {
  value: string;
  showIcon?: boolean;
  isMobile: boolean;
  onShowModal: () => void;
}

export interface IFieldsetSection {
  legend: string;
  items: IFieldItem[];
  isMobile: boolean;
  onShowModal: () => void;
}

export interface ISummarySection {
  items: ISummaryItem[];
  isMobile: boolean;
  onShowModal: () => void;
}
