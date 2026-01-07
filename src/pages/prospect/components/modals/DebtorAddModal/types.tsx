export const titleButtonTextAssited = {
  goBackText: "Anterior",
  goNextText: "Siguiente",
  submitText: "Agregar",
};

export interface IStepDetails {
  id: number;
  number: number;
  name: string;
  description: string;
}

export interface IStep {
  id: number;
  description: string;
  number?: number;
  name?: string;
}

export interface IPersonalInfo {
  tipeOfDocument: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: string;
  age: string;
  relation: string;
}

export interface FormData {
  personalInfo: IPersonalInfo;
}
