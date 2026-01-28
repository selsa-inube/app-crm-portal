import { useEffect, useState, useContext } from "react";

import { postBusinessUnitRules } from "@services/businessUnitRules/EvaluteRuleByBusinessUnit";
import { IBusinessUnitRules } from "@services/businessUnitRules/types";
import { AppContext } from "@context/AppContext";

import { AmountCaptureUI } from "./interface";
import {
  IAmountCaptureProps,
  VALIDATED_NUMBER_REGEX,
  amountCaptureTexts,
} from "../config";

export function AmountCapture(props: IAmountCaptureProps) {
  const {
    creditLine,
    amount,
    moneyDestination,
    businessUnitPublicCode,
    businessManagerCode,
    onChange,
    onFormValid,
  } = props;

  const { eventData } = useContext(AppContext);

  const [loanAmountError, setLoanAmountError] = useState<string>("");
  const [displayValue, setDisplayValue] = useState<string>("");

  const validateLoanAmount = async (amountValue: number): Promise<void> => {
    try {
      setLoanAmountError("");

      if (amountValue <= 0) {
        setLoanAmountError(amountCaptureTexts.errors.zeroAmount);
        return;
      }

      const payload: IBusinessUnitRules = {
        ruleName: "LoanAmountLimit",
        conditions: [
          { condition: "LineOfCredit", value: creditLine },
          { condition: "MoneyDestination", value: moneyDestination },
        ],
      };

      const decisions = await postBusinessUnitRules(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
        eventData.token,
      );

      if (decisions && Array.isArray(decisions) && decisions.length > 0) {
        const decision = decisions[0];

        if (typeof decision.value === "object" && decision.value !== null) {
          const { from, to } = decision.value;

          if (amountValue < from || amountValue > to) {
            setLoanAmountError(amountCaptureTexts.errors.rangeAmount(from, to));
          }
        } else if (typeof decision.value === "string") {
          const maxAmount = Number(decision.value);

          if (!isNaN(maxAmount) && amountValue > maxAmount) {
            setLoanAmountError(amountCaptureTexts.errors.maxAmount(maxAmount));
          }
        }
      } else {
        setLoanAmountError(amountCaptureTexts.errors.validationFailed);
      }
    } catch (error) {
      setLoanAmountError(amountCaptureTexts.errors.validationError);
    }
  };

  useEffect(() => {
    const isValid = amount > 0 && loanAmountError === "";
    onFormValid(isValid);
  }, [amount, loanAmountError, onFormValid]);

  useEffect(() => {
    if (amount > 0) {
      setDisplayValue(
        amount.toLocaleString("es-CO", {
          maximumFractionDigits: 0,
        }),
      );
    } else {
      setDisplayValue("");
    }
  }, []);

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
        const timeoutId = setTimeout(() => {
          validateLoanAmount(numericValue);
        }, 500);
        return () => clearTimeout(timeoutId);
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
