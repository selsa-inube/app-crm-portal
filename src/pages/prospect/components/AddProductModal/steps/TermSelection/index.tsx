import * as Yup from "yup";
import { useEffect, useState, useMemo } from "react";

import { currencyFormat } from "@utils/formatData/currency";
import {
  IPaymentCapacity,
  IPaymentCapacityResponse,
} from "@services/creditLimit/types";
import { getBorrowerPaymentCapacityById } from "@services/creditLimit/getBorrowePaymentCapacity";
import { getPropertyValue } from "@utils/mappingData/mappings";

import { TermSelectionUI } from "./interface";
import {
  ITermSelection,
  ITermSelectionValuesMain,
  VALIDATED_NUMBER_REGEX,
} from "../config";
import { validationMessages } from "../../config";

export function TermSelection(props: ITermSelection) {
  const {
    quotaCapValue,
    maximumTermValue,
    quotaCapEnabled,
    maximumTermEnabled,
    isMobile,
    lang,
    dataProspect,
    businessManagerCode,
    businessUnitPublicCode,
    eventData,
    onChange,
    onFormValid,
    generalTerms,
  } = props;

  const [paymentCapacityData, setPaymentCapacityData] =
    useState<IPaymentCapacityResponse | null>(null);

  useEffect(() => {
    let isValid = false;

    const quotaCapNumeric =
      Number(String(quotaCapValue).replace(VALIDATED_NUMBER_REGEX, "")) || 0;
    const maximumTermNumeric =
      Number(String(maximumTermValue).replace(VALIDATED_NUMBER_REGEX, "")) || 0;

    if (quotaCapEnabled) {
      let isQuotaCapValid = quotaCapNumeric > 0;
      if (paymentCapacity > 0 && quotaCapNumeric > paymentCapacity) {
        isQuotaCapValid = false;
      }
      isValid = isQuotaCapValid;
    } else if (maximumTermEnabled) {
      let isMaximumTermValid = maximumTermNumeric > 0;
      if (generalTerms) {
        const min = generalTerms.minTerm || 0;
        const max = generalTerms.maxTerm || Infinity;

        if (maximumTermNumeric < min || maximumTermNumeric > max) {
          isMaximumTermValid = false;
        }
      }
      isValid = isMaximumTermValid;
    }

    onFormValid(isValid);
  }, [
    quotaCapValue,
    maximumTermValue,
    quotaCapEnabled,
    maximumTermEnabled,
    generalTerms,
    onFormValid,
  ]);

  useEffect(() => {
    if (!quotaCapEnabled && !maximumTermEnabled) {
      onChange({
        quotaCapValue: 0,
        maximumTermValue: 0,
        quotaCapEnabled: true,
        maximumTermEnabled: false,
      });
    }

    if (quotaCapEnabled && maximumTermEnabled) {
      onChange({
        quotaCapValue: quotaCapValue,
        maximumTermValue: 0,
        quotaCapEnabled: true,
        maximumTermEnabled: false,
      });
    }
  }, []);

  const initialValues: ITermSelectionValuesMain = {
    toggles: {
      quotaCapToggle: quotaCapEnabled !== undefined ? quotaCapEnabled : true,
      maximumTermToggle:
        maximumTermEnabled !== undefined ? maximumTermEnabled : false,
    },
    quotaCapValue: quotaCapEnabled ? currencyFormat(quotaCapValue) : "",
    maximumTermValue: maximumTermEnabled ? maximumTermValue : "",
  };

  const paymentCapacity = paymentCapacityData?.paymentCapacity || 0;

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      quotaCapValue: Yup.string().when(
        "toggles.quotaCapToggle",
        (quotaCapToggle, schema) =>
          quotaCapToggle
            ? schema
                .required(validationMessages.requiredField.i18n[lang])
                .test(
                  "is-number",
                  validationMessages.validNumber.i18n[lang],
                  (value) => {
                    const numericValue = Number(
                      String(value).replace(VALIDATED_NUMBER_REGEX, ""),
                    );
                    return !isNaN(numericValue);
                  },
                )
                .test(
                  "max-limit",
                  `${validationMessages.maxLimit.i18n[lang]} ${currencyFormat(paymentCapacity)}`,
                  (value) => {
                    const numericValue = Number(
                      String(value).replace(VALIDATED_NUMBER_REGEX, ""),
                    );
                    return paymentCapacity > 0
                      ? numericValue <= paymentCapacity
                      : true;
                  },
                )
            : schema,
      ),
      maximumTermValue: Yup.string().when(
        "toggles.maximumTermToggle",
        (maximumTermToggle, schema) =>
          maximumTermToggle
            ? schema
                .required(validationMessages.requiredField.i18n[lang])
                .test(
                  "is-number",
                  validationMessages.validNumber.i18n[lang],
                  (value) => {
                    if (!value) return false;
                    return !isNaN(Number(value));
                  },
                )
                .test(
                  "min",
                  `${validationMessages.minMonths.i18n[lang]} ${generalTerms?.minTerm || 1} ${validationMessages.months.i18n[lang]}`,
                  (value) => {
                    if (!value) return false;
                    return Number(value) >= (generalTerms?.minTerm || 1);
                  },
                )
                .test(
                  "max",
                  `${validationMessages.maxMonths.i18n[lang]} ${generalTerms?.maxTerm || Infinity} ${validationMessages.months.i18n[lang]}`,
                  (value) => {
                    if (!value) return false;
                    return Number(value) <= (generalTerms?.maxTerm || Infinity);
                  },
                )
            : schema.nullable().notRequired(),
      ),
    });
  }, [generalTerms, paymentCapacity, lang]);

  const handleValidationsForm = (values: ITermSelectionValuesMain) => {
    const quotaCapNumericValue =
      parseFloat(
        String(values.quotaCapValue).replace(VALIDATED_NUMBER_REGEX, ""),
      ) || 0;
    const maximumTermNumericValue =
      parseFloat(
        String(values.maximumTermValue).replace(VALIDATED_NUMBER_REGEX, ""),
      ) || 0;

    let isMaximumTermValid = maximumTermNumericValue > 0;

    if (generalTerms && values.toggles.maximumTermToggle) {
      const min = generalTerms.minTerm || 0;
      const max = generalTerms.maxTerm || Infinity;
      if (maximumTermNumericValue < min || maximumTermNumericValue > max) {
        isMaximumTermValid = false;
      }
    }

    let isQuotaCapValid = quotaCapNumericValue > 0;
    if (values.toggles.quotaCapToggle && paymentCapacity > 0) {
      if (quotaCapNumericValue > paymentCapacity) {
        isQuotaCapValid = false;
      }
    }

    const isValid =
      (values.toggles.quotaCapToggle && isQuotaCapValid) ||
      (values.toggles.maximumTermToggle && isMaximumTermValid);

    onFormValid(isValid);
  };

  const handleQuotaCapToggleChange = (
    isChecked: boolean = true,
    setFieldValue: (field: string, value: string | number | boolean) => void,
    values: ITermSelectionValuesMain,
  ) => {
    setFieldValue("toggles.quotaCapToggle", isChecked);
    setFieldValue("toggles.maximumTermToggle", !isChecked);

    if (!isChecked) {
      setFieldValue("quotaCapValue", "");
    } else {
      setFieldValue("maximumTermValue", "");
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
      maximumTermEnabled: !isChecked,
    });
  };

  const handleQuotaCapValueChange = (
    rawValue: string,
    setFieldValue: (field: string, value: string | number) => void,
  ) => {
    const numericValue = Number(rawValue.replace(/\D/g, ""));
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
    const parsedValue = numericValue === 0 ? "" : numericValue;

    setFieldValue("maximumTermValue", parsedValue);

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
    setFieldValue("toggles.quotaCapToggle", !isChecked);
    setFieldValue("toggles.maximumTermToggle", isChecked);

    if (!isChecked) {
      setFieldValue("maximumTermValue", "");
    } else {
      setFieldValue("quotaCapValue", "");
    }

    const termNumeric = isChecked ? Number(values.maximumTermValue) : 0;

    onChange({
      quotaCapValue: 0,
      maximumTermValue: termNumeric,
      quotaCapEnabled: !isChecked,
      maximumTermEnabled: isChecked,
    });
  };
  const borrower = dataProspect?.borrowers[0];

  useEffect(() => {
    const fetchCapacityAnalysis = async () => {
      if (!borrower) {
        return;
      }
      const data: IPaymentCapacity = {
        clientIdentificationNumber: borrower.borrowerIdentificationNumber,
        dividends: parseFloat(
          getPropertyValue(borrower.borrowerProperties, "Dividends") || "0",
        ),
        financialIncome: parseFloat(
          getPropertyValue(borrower.borrowerProperties, "FinancialIncome") ||
            "0",
        ),
        leases: parseFloat(
          getPropertyValue(borrower.borrowerProperties, "Leases") || "0",
        ),
        otherNonSalaryEmoluments: parseFloat(
          getPropertyValue(
            borrower.borrowerProperties,
            "OtherNonSalaryEmoluments",
          ) || "0",
        ),
        pensionAllowances: parseFloat(
          getPropertyValue(borrower.borrowerProperties, "PensionAllowances") ||
            "0",
        ),
        periodicSalary: parseFloat(
          getPropertyValue(borrower.borrowerProperties, "PeriodicSalary") ||
            "0",
        ),
        personalBusinessUtilities: parseFloat(
          getPropertyValue(
            borrower.borrowerProperties,
            "PersonalBusinessUtilities",
          ) || "0",
        ),
        professionalFees: parseFloat(
          getPropertyValue(borrower.borrowerProperties, "ProfessionalFees") ||
            "0",
        ),
        livingExpenseToIncomeRatio: 0,
      };

      try {
        const paymentCapacity = await getBorrowerPaymentCapacityById(
          businessUnitPublicCode,
          businessManagerCode,
          data,
          eventData.token,
        );
        setPaymentCapacityData(paymentCapacity ?? null);
      } catch (error: unknown) {
        console.log(error);
      }
    };

    fetchCapacityAnalysis();
  }, []);

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
      lang={lang}
    />
  );
}
