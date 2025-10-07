import { IDomainEnum } from "./types";

export const getEnumByCode = (
  code: string = "",
  language: string,
  enumData: IDomainEnum[],
): string | undefined => {
  if (!enumData || !Array.isArray(enumData)) {
    return code;
  }
  const filterEnums: IDomainEnum | undefined = enumData.find(
    (e) => e.code === code,
  );

  if (filterEnums != undefined) {
    return filterEnums.i18n?.[language] || code;
  } else {
    return code;
  }
};
