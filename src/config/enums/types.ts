export interface IDomainEnum {
  code: string;
  value: string;
  description: string;
  i18n: Record<string, string>;
  index?: number;
  requirementType?: string;
  i18nAttribute?: string;
}

export interface IEnumContextState {
  enums: Record<string, IDomainEnum[]>;
  language: string;
  isLoading: boolean;
  error: string | null;
}

export interface IEnumContextActions {
  getEnums: (businessUnitPublicCode: string, enumName: string) => Promise<void>;
  clearEnums: () => void;
}

export type TEnumContext = IEnumContextState & IEnumContextActions;
