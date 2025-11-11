export interface IStaffSubOption {
  abbreviatedName: string;
  descriptionUse: string;
  optionStaffId: string;
  publicCode: string;
}

export interface IOptionStaff {
  abbreviatedName: string;
  descriptionUse: string;
  optionStaffId: string;
  parentOptionId: string;
  publicCode: string;
  iconReference: string;
  subOption: IStaffSubOption;
}
