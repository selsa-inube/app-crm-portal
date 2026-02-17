export const areValuesEqual = (
  newValue: string | number | undefined,
  originalValue: string | number | undefined,
  precision: number = 4,
): boolean => {
  if (newValue === originalValue) return true;

  const numNew = Number(newValue);
  const numOld = Number(originalValue);

  if (isNaN(numNew) || isNaN(numOld)) {
    return String(newValue) === String(originalValue);
  }

  return numNew.toFixed(precision) === numOld.toFixed(precision);
};
