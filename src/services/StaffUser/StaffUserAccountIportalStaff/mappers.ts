import { IStaffUserAccount } from "@ptypes/staffPortalBusiness.types";

const mapStaffUserAccountApiToEntity = (
  data: Record<string, string | number | object>,
): IStaffUserAccount => {
  const mappedUserAccount: IStaffUserAccount = {
    accountName: typeof data.accountName === "string" ? data.accountName : "",
    biologicalSex: typeof data.biologicalSex === "string" ? data.biologicalSex : "",
    birthDay:
      typeof data.birthDay === "string" && !isNaN(Date.parse(data.birthDay))
        ? new Date(data.birthDay)
        : new Date(),
    principalEmail: typeof data.principalEmail === "string" ? data.principalEmail : "",
    principalPhone: typeof data.principalPhone === "string" ? data.principalPhone : "",
    userAccount: typeof data.userAccount === "string" ? data.userAccount : "",
    userAccountId: typeof data.userAccountId === "string" ? data.userAccountId : "",
  };

  return mappedUserAccount;
};

const mapStaffUserAccountApiToEntities = (
  data: Record<string, string | number | object>[],
): IStaffUserAccount[] => {
  return data.map(mapStaffUserAccountApiToEntity);
};

export { mapStaffUserAccountApiToEntity, mapStaffUserAccountApiToEntities };
