export type appearances = "dark" | "primary";

interface ITitleName {
  code: string;
  description: string;
  i18n: {
    en: string;
    es: string;
  };
}

export interface ITitle {
  id: string;
  titleName: string | ITitleName;
  priority: number;
}

export interface IEntries {
  id: string;
  [key: string]: React.ReactNode;
}

export interface IAction {
  id: string;
  actionName?: string | ITitleName;
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
