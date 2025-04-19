export type appearances = "dark" | "primary";

export interface ITitle {
  id: string;
  titleName: string;
  priority: number;
}

export interface IEntries {
  id: string;
  [key: string]: React.ReactNode;
}

export interface IAction {
  id: string;
  actionName?: string;
  content: (entry: IEntries) => React.ReactNode;
  mobilePriority?: boolean;
}

export interface IAppearances {
  title?: appearances;
  efectzebra?: boolean;
  borderTable?: boolean;
  background?: boolean;
  widthTd?: string;
  isStyleMobile?: boolean;
}

export interface IInfoItems {
  isFirstTable?: boolean;
  infoItems?: { icon: JSX.Element; text: string }[];
}

export interface IRenderActionsTitles {
  actions: IAction[];
  isTablet: boolean;
  appearance: appearances;
  isStyleMobile: boolean;
  isFirstTable: boolean;
  onInfoClick: () => void;
}

export interface IActionsComponent {
  actions: IAction[];
  isTablet: boolean;
  entry: IEntries;
  actionMobile?: IAction[];
}

export interface Requirement {
  id: string;
  titles: ITitle[];
  entries: IEntries[];
}
