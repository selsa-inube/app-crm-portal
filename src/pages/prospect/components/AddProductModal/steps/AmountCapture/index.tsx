import { useEffect, useState } from "react";

import { AmountCaptureUI } from "./interface";
import {
  IAmountCaptureProps,
  VALIDATED_NUMBER_REGEX,
  amountCaptureTexts,
} from "../config";

export function AmountCapture(props: IAmountCaptureProps) {
  const { amount, onChange, onFormValid, generalTerms } = props;

  const [loanAmountError, setLoanAmountError] = useState<string>("");
  const [displayValue, setDisplayValue] = useState<string>("");

  const validateLoanAmount = (amountValue: number): void => {
    setLoanAmountError("");

    if (amountValue <= 0) {
      setLoanAmountError(amountCaptureTexts.errors.zeroAmount);
      return;
    }

    if (generalTerms) {
      const minAmount = generalTerms.minAmount || 0;
      const maxAmount = generalTerms.maxAmount || Infinity;

      if (amountValue < minAmount || amountValue > maxAmount) {
        setLoanAmountError(
          amountCaptureTexts.errors.rangeAmount(minAmount, maxAmount),
        );
      }
    }
  };

  useEffect(() => {
    const isValid = amount > 0 && loanAmountError === "";
    onFormValid(isValid);
  }, [amount, loanAmountError, onFormValid]);

  useEffect(() => {
    if (amount > 0) {
      setDisplayValue(
        amount.toLocaleString("es-CO", { maximumFractionDigits: 0 }),
      );
    } else {
      setDisplayValue("");
    }
  }, [amount]);

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(VALIDATED_NUMBER_REGEX, "");
    const numericValue = Number(rawValue);

    if (rawValue === "") {
      setDisplayValue("");
      onChange(0);
      setLoanAmountError("");
    } else {
      setDisplayValue(
        numericValue.toLocaleString("es-CO", {
          maximumFractionDigits: 0,
        }),
      );
      onChange(numericValue);

      if (numericValue > 0) {
        validateLoanAmount(numericValue);
      }
    }
  };

  return (
    <AmountCaptureUI
      displayValue={displayValue}
      loanAmountError={loanAmountError}
      amountCaptureTexts={amountCaptureTexts}
      handleCurrencyChange={handleCurrencyChange}
    />
  );
}
