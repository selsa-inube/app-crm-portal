import { IOptionStaff, IStaffSubOption } from "./types";

const mapStaffOptionToEntity = (
  data: Record<string, string | number | object>,
): IOptionStaff => {
  const buildResend: IOptionStaff = {
    abbreviatedName: data.abbreviatedName as string,
    descriptionUse: data.descriptionUse as string,
    optionStaffId: data.optionStaffId as string,
    parentOptionId: data.parentOptionId as string,
    publicCode: data.publicCode as string,
    iconReference: data.iconReference as string,
    subOption: data.subOption as IStaffSubOption,
  };
  return buildResend;
};

export { mapStaffOptionToEntity };
