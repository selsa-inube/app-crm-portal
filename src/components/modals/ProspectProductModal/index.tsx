import { useEffect, useState } from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import { Stack, useMediaQuery, Text, Grid } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { truncateTextToMaxLength } from "@utils/formatData/text";
import { getLinesOfCreditByMoneyDestination } from "@services/lineOfCredit/getLinesOfCreditByMoneyDestination";
import { ICustomerData } from "@context/CustomerContext/types";
import { ruleConfig } from "@pages/simulateCredit/config/configRules";
import { evaluateRule } from "@pages/simulateCredit/evaluateRule";
import { postBusinessUnitRules } from "@services/businessUnitRules/EvaluteRuleByBusinessUnit";

import { ScrollableContainer } from "./styles";
import { messageNotFound } from "./config";
import { CardProductSelection } from "@pages/simulateCredit/components/CardProductSelection";

export interface IEditProductModalProps {
  onCloseModal: () => void;
  onConfirm: (values: IFormValues) => void;
  title: string;
  confirmButtonText: string;
  initialValues: Partial<IFormValues>;
  moneyDestination: string;
  businessUnitPublicCode: string;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
  customerData?: ICustomerData;
}

export type TRuleEvaluationResult = {
  value: number | string;
  [key: string]: string | number;
};

export type TCreditLineTerms = Record<
  string,
  {
    LoanAmountLimit: number;
    LoanTermLimit: number;
    RiskFreeInterestRate: number;
  }
>;

export interface IFormValues {
  selectedProducts: string[];
  creditLine?: string;
  creditAmount?: number;
  paymentMethod?: string;
  paymentCycle?: string;
  firstPaymentCycle?: string;
  termInMonths?: number;
  amortizationType?: string;
  interestRate?: number;
  rateType?: string;
}

export type TRulePrimitiveValue = number | string;

export type TRuleArrayValue = Array<TRuleEvaluationResult | TRulePrimitiveValue | undefined>;


export type TRuleInput =
  | TRulePrimitiveValue
  | TRuleEvaluationResult
  | TRuleArrayValue
  | null
  | undefined;

export const isRuleObject = (
  value: TRuleInput
): value is TRuleEvaluationResult => {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "value" in value &&
    (typeof value.value === "string" || typeof value.value === "number")
  );
};

const isRulePrimitive = (
  value: TRuleInput | TRuleEvaluationResult | TRulePrimitiveValue
): value is TRulePrimitiveValue => {
  return typeof value === "string" || typeof value === "number";
};

const isRuleArray = (
  value: TRuleInput
): value is TRuleArrayValue => {
  return Array.isArray(value);
};
function EditProductModal(props: IEditProductModalProps) {
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
    selectedProducts: Yup.array().of(Yup.string()),
  });

  return (
    <Formik
      initialValues={{
        ...initialValues,
        selectedProducts: [] as string[],
      }}
      validationSchema={validationSchema}
      onSubmit={(
        values: IFormValues,
        formikHelpers: FormikHelpers<IFormValues>,
      ) => {
        onConfirm(values);
        formikHelpers.setSubmitting(false);
      }}
    >
      {(formik) => (
        <BaseModal
          title={truncateTextToMaxLength(title, 25)}
          backButton="Cancelar"
          nextButton={confirmButtonText}
          handleNext={formik.submitForm}
          handleBack={onCloseModal}
          disabledNext={!formik.dirty || !formik.isValid}
          iconBeforeNext={iconBefore}
          iconAfterNext={iconAfter}
          finalDivider={true}
          width="auto"
        >
          <ScrollableContainer $smallScreen={isMobile}>
            <Grid
              gap="16px"
              padding={isMobile ? "0px 6px" : "0px 12px"}
              templateColumns={`repeat(1, ${isMobile ? "auto" : "455px"})`}
              autoRows="200px"
              justifyContent="center"
              alignContent="center"
            >
              {Object.keys(creditLineTerms).length > 0 ? (
                Object.entries(creditLineTerms).map(
                  ([lineName, terms], index) => (
                    <Stack key={index} direction="row" width="auto">
                      <CardProductSelection
                        isMobile={isMobile}
                        typeCheck="radio"
                        key={lineName}
                        amount={terms.LoanAmountLimit}
                        rate={terms.RiskFreeInterestRate}
                        term={terms.LoanTermLimit}
                        description={lineName}
                        disabled={false}
                        isSelected={formik.values.selectedProducts.includes(
                          lineName,
                        )}
                        onSelect={() => {
                          formik.setFieldValue("selectedProducts", [lineName]);
                        }}
                      />
                    </Stack>
                  ),
                )
              ) : (
                <Text type="body" size="medium">
                  {messageNotFound}
                </Text>
              )}
            </Grid>
          </ScrollableContainer>
        </BaseModal>
      )}
    </Formik>
  );
}

export { EditProductModal };
