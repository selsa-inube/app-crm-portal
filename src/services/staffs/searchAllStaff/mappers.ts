import { IStaff, IStaffByBusinessUnitAndRole } from "./types";

const mapStaffToEntity = (
  data: Record<string, string | number | object>,
): IStaff => {
  const buildResend: IStaff = {
    biologicalSex: data.biologicalSex as string,
    birthDay: data.birthDay as string,
    businessManagerCode: data.businessManagerCode as string,
    identificationDocumentNumber: data.identificationDocumentNumber as string,
    identificationTypeNaturalPerson:
      data.identificationTypeNaturalPerson as string,
    missionName: data.missionName as string,
    principalEmail: data.principalEmail as string,
    principalPhone: data.principalPhone as string,
    staffByBusinessUnitAndRole:
      data.staffByBusinessUnitAndRole as IStaffByBusinessUnitAndRole,
    staffId: data.staffId as string,
    staffName: data.staffName as string,
    userAccount: data.userAccount as string,
  };
  return buildResend;
};

export { mapStaffToEntity };
