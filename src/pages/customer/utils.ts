export const isNumericString = (value: string): boolean => {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }
  return /^\d+$/.test(value);
};

export const isValidUpperCaseName = (value: string): boolean => {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }
  return /^[A-ZÁÉÍÓÚÑ\s]+$/.test(value);
};
