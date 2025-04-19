interface IPersonalDataEntry {
  id: string;
  names: string;
  lastNames: string;
  identificationNumber: string;
  attachedFile?: File;
}

export type { IPersonalDataEntry };
