import { useEffect, useState } from "react";
import * as Yup from "yup";

import { useMediaQuery } from "@inubekit/inubekit";

import { getLinesOfCreditByMoneyDestination } from "@services/lineOfCredit/getLinesOfCreditByMoneyDestination";
import { ruleConfig } from "@pages/simulateCredit/config/configRules";
import { evaluateRule } from "@pages/simulateCredit/evaluateRule";
import { postBusinessUnitRules } from "@services/businessUnitRules/EvaluteRuleByBusinessUnit";

import {
  isRuleArray,
  isRuleObject,
  isRulePrimitive,
  IAddProductModalProps,
  TCreditLineTerms,
  TRuleInput,
} from "./config";
import { AddProductModalUI } from "./interface";

function AddProductModal(props: IAddProductModalProps) {
  const {
    onCloseModal,
    onConfirm,
    title,
    confirmButtonText,
    initialValues,
    iconBefore,
    iconAfter,
    moneyDestination,
    businessUnitPublicCode,
    customerData,
  } = props;

  const [creditLineTerms, setCreditLineTerms] = useState<TCreditLineTerms>({});

  const getMonthsElapsed = (dateString: string, decimal: number): number => {
    const startDate = new Date(dateString);
    const currentDate = new Date();

    const yearsDiff = currentDate.getFullYear() - startDate.getFullYear();
    const monthsDiff = currentDate.getMonth() - startDate.getMonth();
    const daysDiff = currentDate.getDate() - startDate.getDate();

    let totalMonths = yearsDiff * 12 + monthsDiff;

    if (daysDiff > 0) {
      totalMonths += daysDiff / 30;
    }

    const years = Math.floor(totalMonths / 12);
    const months = (totalMonths % 12) / 12;

    return parseFloat((years + months).toFixed(decimal));
  };

  const getRuleValue = (input: TRuleInput): number | string | null => {
    if (isRuleArray(input)) {
      const first = input[0];

      if (first === null || first === undefined) {
        return null;
      }

      if (isRuleObject(first)) {
        return first.value;
      }

      if (isRulePrimitive(first)) {
        return first;
      }

      return null;
    }

    if (isRuleObject(input)) {
      return input.value;
    }

    if (isRulePrimitive(input)) {
      return input;
    }

    return null;
  };

  useEffect(() => {
    (async () => {
      const clientInfo =
        customerData?.generalAttributeClientNaturalPersons?.[0];
      if (!clientInfo?.associateType) return;

      const baseDataRules = {
        MoneyDestination: moneyDestination,
        ClientType: clientInfo.associateType?.substring(0, 1) || "",
        EmploymentContractTermType:
          clientInfo.employmentType?.substring(0, 2) || "",
        AffiliateSeniority: getMonthsElapsed(
          customerData!.generalAssociateAttributes?.[0]?.affiliateSeniorityDate,
          0,
        ),
      };

      const lineOfCreditValues = await getLinesOfCreditByMoneyDestination(
        businessUnitPublicCode,
        "education",
        moneyDestination,
      );

      type LineOfCreditValue = string | { value: string } | null | undefined;
      const lineNames = Array.isArray(lineOfCreditValues)
        ? (lineOfCreditValues as LineOfCreditValue[])
            .map((v) => (typeof v === "string" ? v : v?.value || ""))
            .filter((name): name is string => Boolean(name))
        : [];

      const result: TCreditLineTerms = {};

      for (const line of lineNames) {
        const ruleData = { ...baseDataRules, LineOfCredit: line };

        const loanAmountRule = ruleConfig["LoanAmountLimit"]?.(ruleData);
        const loanAmount = loanAmountRule
          ? await evaluateRule(
              loanAmountRule,
              postBusinessUnitRules,
              "value",
              businessUnitPublicCode,
              "",
              true,
            )
          : null;
        const amountValue = Number(getRuleValue(loanAmount) ?? 0);

        const termRuleInput = {
          ...ruleData,
          LoanAmount: amountValue,
        };
        const termRule = ruleConfig["LoanTerm"]?.(termRuleInput);
        const termValueRaw = termRule
          ? await evaluateRule(
              termRule,
              postBusinessUnitRules,
              "value",
              businessUnitPublicCode,
              "",
              true,
            )
          : null;
        const termValue = Number(getRuleValue(termValueRaw) ?? 0);

        const interestInput = {
          ...ruleData,
          LoanAmount: amountValue,
          LoanTerm: termValue,
        };
        const interestRule = ruleConfig["FixedInterestRate"]?.(interestInput);
        const rateValueRaw = interestRule
          ? await evaluateRule(
              interestRule,
              postBusinessUnitRules,
              "value",
              businessUnitPublicCode,
              "",
              true,
            )
          : null;
        const interestRate = Number(getRuleValue(rateValueRaw) ?? 0);

        result[line] = {
          LoanAmountLimit: amountValue,
          LoanTermLimit: termValue,
          RiskFreeInterestRate: interestRate,
        };
      }

      setCreditLineTerms(result);
    })();
  }, [businessUnitPublicCode]);

  const isMobile = useMediaQuery("(max-width: 550px)");

  const validationSchema = Yup.object({
    creditLine: Yup.string(),
    creditAmount: Yup.number(),
    paymentMethod: Yup.string(),
    paymentCycle: Yup.string(),
    firstPaymentCycle: Yup.string(),
    termInMonths: Yup.number(),
    amortizationType: Yup.string(),
    interestRate: Yup.number().min(0, ""),
    rateType: Yup.string(),
    selectedProducts: Yup.array()
      .of(Yup.string().required())
      .default([])
      .required(),
  });

  return (
    <AddProductModalUI
      title={title}
      confirmButtonText={confirmButtonText}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onConfirm={onConfirm}
      onCloseModal={onCloseModal}
      iconBefore={iconBefore}
      iconAfter={iconAfter}
      creditLineTerms={creditLineTerms}
      isMobile={isMobile}
    />
  );
}

export { AddProductModal };
