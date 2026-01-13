export interface IDomainEnum {
  code: string;
  value: string;
  description: string;
  i18n: Record<string, string>;
  I18nValue?: Record<string, string>;
  index?: number;
  requirementType?: string;
  i18nAttribute?: string;
}

export interface IEnumContextState {
  enums: Record<string, IDomainEnum[]>;
  language: string;
}

export interface IEnumContextActions {
  getEnums: (enumName: string) => Promise<void>;
}

export type TEnumContext = IEnumContextState & IEnumContextActions;
