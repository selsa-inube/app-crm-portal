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
