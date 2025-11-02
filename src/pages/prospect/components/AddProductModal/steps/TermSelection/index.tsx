import * as Yup from "yup";

import { currencyFormat } from "@utils/formatData/currency";

import { TermSelectionUI } from "./interface";
import {
  ITermSelection,
  ITermSelectionValuesMain,
  VALIDATED_NUMBER_REGEX,
} from "../config";

export function TermSelection(props: ITermSelection) {
  const {
    quotaCapValue,
    maximumTermValue,
    quotaCapEnabled,
    maximumTermEnabled,
    isMobile,
    onChange,
    onFormValid,
  } = props;

  const initialValues: ITermSelectionValuesMain = {
    toggles: {
      quotaCapToggle: quotaCapEnabled,
      maximumTermToggle: maximumTermEnabled,
    },
    quotaCapValue: quotaCapEnabled ? currencyFormat(quotaCapValue) : "",
    maximumTermValue: maximumTermEnabled ? maximumTermValue : "",
  };

  const validationSchema = Yup.object().shape({
    quotaCapValue: Yup.string().when(
      "toggles.quotaCapToggle",
      (quotaCapToggle, schema) =>
        quotaCapToggle ? schema.required("") : schema,
    ),
    maximumTermValue: Yup.string().when(
      "toggles.maximumTermToggle",
      (maximumTermToggle, schema) =>
        maximumTermToggle ? schema.required("") : schema,
    ),
  });

  const handleValidationsForm = (values: ITermSelectionValuesMain) => {
    const quotaCapNumericValue =
      parseFloat(
        String(values.quotaCapValue).replace(VALIDATED_NUMBER_REGEX, ""),
      ) || 0;
    const maximumTermNumericValue =
      parseFloat(
        String(values.maximumTermValue).replace(VALIDATED_NUMBER_REGEX, ""),
      ) || 0;

    const isValid =
      (values.toggles.quotaCapToggle && quotaCapNumericValue > 0) ||
      (values.toggles.maximumTermToggle && maximumTermNumericValue > 0);

    onFormValid(isValid);
  };

  const handleQuotaCapToggleChange = (
    isChecked: boolean,
    setFieldValue: (field: string, value: string | number | boolean) => void,
    values: ITermSelectionValuesMain,
  ) => {
    setFieldValue("toggles.quotaCapToggle", isChecked);
    setFieldValue("toggles.maximumTermToggle", false);
    setFieldValue("maximumTermValue", "");

    if (!isChecked) {
      setFieldValue("quotaCapValue", "");
    }

    const quotaCapNumeric = isChecked
      ? parseFloat(
          String(values.quotaCapValue).replace(VALIDATED_NUMBER_REGEX, ""),
        ) || 0
      : 0;

    onChange({
      quotaCapValue: quotaCapNumeric,
      maximumTermValue: 0,
      quotaCapEnabled: isChecked,
      maximumTermEnabled: false,
    });
  };

  const handleQuotaCapValueChange = (
    rawValue: string,
    setFieldValue: (field: string, value: string | number) => void,
  ) => {
    const numericValue = Number(rawValue.replace(VALIDATED_NUMBER_REGEX, ""));
    const formattedValue = currencyFormat(numericValue);

    setFieldValue("quotaCapValue", formattedValue);

    onChange({
      quotaCapValue: numericValue,
      maximumTermValue: 0,
      quotaCapEnabled: true,
      maximumTermEnabled: false,
    });
  };

  const handleMaximumTermValueChange = (
    numericValue: number,
    setFieldValue: (field: string, value: string | number) => void,
  ) => {
    setFieldValue("maximumTermValue", numericValue);

    onChange({
      quotaCapValue: 0,
      maximumTermValue: numericValue,
      quotaCapEnabled: false,
      maximumTermEnabled: true,
    });
  };

  const handleMaximumTermToggleChange = (
    isChecked: boolean,
    setFieldValue: (field: string, value: string | number | boolean) => void,
    values: ITermSelectionValuesMain,
  ) => {
    setFieldValue("toggles.quotaCapToggle", false);
    setFieldValue("toggles.maximumTermToggle", isChecked);
    setFieldValue("quotaCapValue", "");
    setFieldValue("maximumTermValue", isChecked ? values.maximumTermValue : "");

    const termNumeric = isChecked ? Number(values.maximumTermValue) : 0;

    onChange({
      quotaCapValue: 0,
      maximumTermValue: termNumeric,
      quotaCapEnabled: false,
      maximumTermEnabled: isChecked,
    });
  };

  return (
    <TermSelectionUI
      isMobile={isMobile}
      initialValues={initialValues}
      validationSchema={validationSchema}
      handleValidationsForm={handleValidationsForm}
      handleQuotaCapToggleChange={handleQuotaCapToggleChange}
      handleQuotaCapValueChange={handleQuotaCapValueChange}
      handleMaximumTermToggleChange={handleMaximumTermToggleChange}
      handleMaximumTermValueChange={handleMaximumTermValueChange}
    />
  );
}
