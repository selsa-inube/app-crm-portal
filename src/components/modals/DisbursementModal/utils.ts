export const formatNoData = (value: string | undefined | null): string => {
  if (!value || value.trim() === "") {
    return "No se ha generado ";
  }
  return value;
};
export const formatYesNo = (value: string | undefined | null): string => {
  return value === "Y" ? "Sí" : "No";
};
export const formatBiologicalSex = (
  value: string | undefined | null,
): string => {
  if (value === "F") return "Femenino";
  if (value === "M") return "Masculino";
  return value || "";
};
export const formatObservation = (value: string | undefined | null): string => {
  if (!value || value.trim() === "") {
    return "No tiene observaciones";
  }
  return value;
};
