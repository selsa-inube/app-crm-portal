export interface I18nText {
  en: string;
  es: string;
}

export interface IEnumItem {
  code: string;
  description?: string;
  value?: string;
  i18nAttribute?: string;
  i18n: I18nText;
}

export interface IAllEnumsResponse {
  [key: string]: IEnumItem[] | undefined;
}
