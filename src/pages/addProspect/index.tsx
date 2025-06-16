import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@inubekit/inubekit";

import { Consulting } from "@components/modals/Consulting";
import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";
import { getMonthsElapsed } from "@utils/formatData/currency";
import { postBusinessUnitRules } from "@services/businessUnitRules";
import { IPaymentChannel } from "@services/types";

import { stepsAddProspect } from "./config/addProspect.config";
import { IFormData } from "./types";
import { AddProspectUI } from "./interface";
import { ruleConfig } from "./config/configRules";
import { evaluateRule } from "./evaluateRule";

export function AddProspect() {
  const [currentStep, setCurrentStep] = useState<number>(
    stepsAddProspect.generalInformation.id,
  );
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(true);
  const [showConsultingModal, setShowConsultingModal] = useState(false);
  const [isModalOpenRequirements, setIsModalOpenRequirements] = useState(false);
  const [isCreditLimitModalOpen, setIsCreditLimitModalOpen] = useState(false);
  const [isCapacityAnalysisModal, setIsCapacityAnalysisModal] = useState(false);
  const [requestValue, setRequestValue] = useState<IPaymentChannel[]>();
  const isMobile = useMediaQuery("(max-width:880px)");
  const isTablet = useMediaQuery("(max-width: 1482px)");

  const steps = Object.values(stepsAddProspect);
  const navigate = useNavigate();

  const { customerData } = useContext(CustomerContext);
  const { businessUnitSigla } = useContext(AppContext);
  const { customerPublicCode } = useParams();

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
  };

  const [formData, setFormData] = useState<IFormData>({
    selectedDestination: "",
    selectedProducts: [],
    loanConditionState: {
      toggles: { quotaCapToggle: true, maximumTermToggle: false },
      quotaCapValue: "",
      maximumTermValue: "",
    },
    generalToggleChecked: true,
    togglesState: [false, false, false, false],
    borrowerData: {
      initialBorrowers: {
        id: "",
        name: "",
        debtorDetail: {
          document: "",
          documentNumber: "",
          name: "",
          lastName: "",
          email: "",
          number: "",
          sex: "",
          age: "",
          relation: "",
        },
      },
    },
    loanAmountState: {
      inputValue: "",
      toggleChecked: false,
      paymentPlan: "",
      periodicity: "",
      payAmount: "",
    },
    consolidatedCreditSelections: { totalCollected: 0, selectedValues: {} },
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const [valueRule, setValueRule] = useState<{ [ruleName: string]: string[] }>(
    {},
  );

  const [creditLineTerms, setCreditLineTerms] = useState<{
    [lineName: string]: {
      LoanAmountLimit: number;
      LoanTermLimit: number;
      RiskFreeInterestRate: number;
    };
  }>({});

  const getRuleByName = useCallback(
    (ruleName: string) => {
      const raw = valueRule?.[ruleName] || [];
      return (
        raw
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((v: any) => (typeof v === "string" ? v : v?.value))
          .filter(Boolean)
      );
    },
    [valueRule],
  );

  const getAllDataRuleByName = useCallback(
    (ruleName: string) => {
      const raw = valueRule?.[ruleName] || [];
      return raw;
    },
    [valueRule],
  );

  type RuleEvaluationResult = {
    value: number | string;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };

  const getRuleValue = (input: unknown): number | string | null => {
    if (Array.isArray(input)) {
      const first = input[0];
      return first && typeof first === "object" && "value" in first
        ? (first as RuleEvaluationResult).value
        : (first ?? null);
    }

    if (input !== null && typeof input === "object" && "value" in input) {
      return (input as RuleEvaluationResult).value;
    }

    return typeof input === "string" || typeof input === "number"
      ? input
      : null;
  };

  const fetchCreditLineTerms = useCallback(async () => {
    const clientInfo = customerData?.generalAttributeClientNaturalPersons?.[0];
    if (!clientInfo?.associateType) return;

    const baseDataRules = {
      MoneyDestination: formData.selectedDestination,
      ClientType: clientInfo.associateType?.substring(0, 1) || "",
      EmploymentContractTermType:
        clientInfo.employmentType?.substring(0, 2) || "",
      AffiliateSeniority: getMonthsElapsed(
        customerData.generalAssociateAttributes?.[0]?.affiliateSeniorityDate,
        0,
      ),
    };

    const lineOfCreditRule = ruleConfig["LineOfCredit"]?.({
      ...baseDataRules,
      LineOfCredit: "",
    });

    if (!lineOfCreditRule) return;

    const lineOfCreditValues = await evaluateRule(
      lineOfCreditRule,
      postBusinessUnitRules,
      "value",
      businessUnitPublicCode,
      true,
    );

    const lineNames = Array.isArray(lineOfCreditValues)
      ? lineOfCreditValues
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((v: any) => (typeof v === "string" ? v : v?.value || ""))
          .filter(Boolean)
      : [];

    const result: Record<
      string,
      {
        LoanAmountLimit: number;
        LoanTermLimit: number;
        RiskFreeInterestRate: number;
      }
    > = {};

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
      const termRule = ruleConfig["LoanTermLimit"]?.(termRuleInput);
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
      const interestRule = ruleConfig["RiskFreeInterestRate"]?.(interestInput);
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
  }, [
    customerData,
    businessUnitPublicCode,
    formData.selectedDestination,
    formData.selectedProducts,
  ]);

  const fetchCreditLinePermissions = useCallback(async () => {
    const clientInfo = customerData?.generalAttributeClientNaturalPersons?.[0];
    if (!clientInfo?.associateType) return;

    const baseDataRules = {
      MoneyDestination: formData.selectedDestination,
      ClientType: clientInfo.associateType?.substring(0, 1) || "",
      EmploymentContractTermType:
        clientInfo.employmentType?.substring(0, 2) || "",
      AffiliateSeniority: getMonthsElapsed(
        customerData.generalAssociateAttributes?.[0]?.affiliateSeniorityDate,
        0,
      ),
    };

    const products =
      formData.selectedProducts?.length > 0
        ? formData.selectedProducts
        : Object.keys(valueRule || {});

    const rulesToValidate = [
      "PercentagePayableViaExtraInstallments",
      "IncomeSourceUpdateAllowed",
    ];
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const groupedResults: Record<string, Record<string, any[]>> = {};

    await Promise.all(
      products.map(async (product) => {
        const productData = { ...baseDataRules, LineOfCredit: product };

        groupedResults[product] = {};

        await Promise.all(
          rulesToValidate.map(async (ruleName) => {
            const rule = ruleConfig[ruleName]?.(productData);
            if (!rule) return;

            const result = await evaluateRule(
              rule,
              postBusinessUnitRules,
              "value",
              businessUnitPublicCode,
              true,
            );

            groupedResults[product][ruleName] = Array.isArray(result)
              ? result
              : [result];
          }),
        );
      }),
    );

    setValueRule(() => {
      const flattened: { [ruleName: string]: string[] } = {};

      Object.values(groupedResults).forEach((rules) => {
        Object.entries(rules).forEach(([ruleName, arr]) => {
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cleanedValues = arr.map((v: any) =>
            typeof v === "string" ? v : (v?.value ?? ""),
          );

          if (!flattened[ruleName]) {
            flattened[ruleName] = cleanedValues;
          } else {
            flattened[ruleName] = Array.from(
              new Set([...flattened[ruleName], ...cleanedValues]),
            );
          }
        });
      });

      return flattened;
    });
  }, [
    customerData,
    businessUnitPublicCode,
    formData.selectedDestination,
    formData.selectedProducts,
    valueRule,
  ]);

  useEffect(() => {
    if (customerData) {
      fetchCreditLineTerms();
      fetchCreditLinePermissions();
    }
  }, [customerData, fetchCreditLineTerms]);

  useEffect(() => {
    if (formData.generalToggleChecked) {
      setSelectedProducts([]);
      setFormData((prev) => ({ ...prev, selectedProducts: [] }));
    }
  }, [formData.generalToggleChecked]);

  const handleFormDataChange = (
    field: string,
    newValue: string | number | boolean,
  ) => {
    setFormData((prevState) => ({ ...prevState, [field]: newValue }));
  };

  const handleConsolidatedCreditChange = (
    creditId: string,
    oldValue: number,
    newValue: number,
  ) => {
    setFormData((prevState) => {
      const updatedSelections = {
        ...prevState.consolidatedCreditSelections.selectedValues,
        [creditId]: newValue,
      };

      const newTotalCollected =
        prevState.consolidatedCreditSelections.totalCollected -
        oldValue +
        newValue;

      return {
        ...prevState,
        consolidatedCreditSelections: {
          totalCollected: newTotalCollected,
          selectedValues: updatedSelections,
        },
      };
    });
  };

  useEffect(() => {
    if (currentStep === stepsAddProspect.productSelection.id) {
      setFormData((prevState) => ({
        ...prevState,
        togglesState: [false, false, false, false],
      }));
    }
  }, [currentStep]);

  const currentStepsNumber = steps.find(
    (step: { number: number }) => step.number === currentStep,
  );

  const handleNextStep = () => {
    const { togglesState } = formData;

    const isInExtraBorrowersStep =
      currentStep === stepsAddProspect.extraBorrowers.id;

    const dynamicSteps = [
      togglesState[0]
        ? stepsAddProspect.extraordinaryInstallments.id
        : undefined,
      togglesState[3] ? stepsAddProspect.extraBorrowers.id : undefined,
      ...(isInExtraBorrowersStep
        ? []
        : [
            togglesState[1] ? stepsAddProspect.sourcesIncome.id : undefined,
            togglesState[2]
              ? stepsAddProspect.obligationsFinancial.id
              : undefined,
          ]),
      stepsAddProspect.loanConditions.id,
    ].filter((step): step is number => step !== undefined);

    const currentStepIndex = dynamicSteps.indexOf(currentStep);

    if (currentStep === stepsAddProspect.loanConditions.id) {
      showConsultingForFiveSeconds();
    }
    if (currentStep === stepsAddProspect.productSelection.id) {
      setCurrentStep(dynamicSteps[0]);
    } else if (
      currentStepIndex !== -1 &&
      currentStepIndex + 1 < dynamicSteps.length
    ) {
      setCurrentStep(dynamicSteps[currentStepIndex + 1]);
    } else if (currentStep + 1 <= steps.length && isCurrentFormValid) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === steps.length) {
      handleSubmitClick();
    }
  };

  const handlePreviousStep = () => {
    const { togglesState } = formData;

    const nextStepWouldBeExtraBorrowers =
      currentStep === stepsAddProspect.loanConditions.id && togglesState[3];

    const dynamicSteps = [
      togglesState[0]
        ? stepsAddProspect.extraordinaryInstallments.id
        : undefined,
      togglesState[3] ? stepsAddProspect.extraBorrowers.id : undefined,
      ...(nextStepWouldBeExtraBorrowers
        ? []
        : [
            togglesState[1] ? stepsAddProspect.sourcesIncome.id : undefined,
            togglesState[2]
              ? stepsAddProspect.obligationsFinancial.id
              : undefined,
          ]),
      stepsAddProspect.loanConditions.id,
    ].filter((step): step is number => step !== undefined);

    const currentStepIndex = dynamicSteps.indexOf(currentStep);

    if (currentStepIndex > 0) {
      setCurrentStep(dynamicSteps[currentStepIndex - 1]);
    } else if (currentStepIndex === 0) {
      setCurrentStep(stepsAddProspect.productSelection.id);
    } else if (currentStep - 1 >= steps[0].id) {
      setCurrentStep(currentStep - 1);
    }
    setIsCurrentFormValid(true);
  };

  const handleSubmitClick = () => {
    setTimeout(() => {
      navigate(`/credit/edit-prospect/${customerPublicCode}/SC-122254646`);
    }, 1000);
  };

  const showConsultingForFiveSeconds = () => {
    setShowConsultingModal(true);
    setTimeout(() => {
      setShowConsultingModal(false);
    }, 2000);
  };

  return (
    <>
      <AddProspectUI
        steps={steps}
        currentStep={currentStep}
        customerData={customerData}
        isCurrentFormValid={isCurrentFormValid}
        isModalOpenRequirements={isModalOpenRequirements}
        isCreditLimitModalOpen={isCreditLimitModalOpen}
        requestValue={requestValue}
        setRequestValue={setRequestValue}
        setIsCreditLimitModalOpen={setIsCreditLimitModalOpen}
        setIsModalOpenRequirements={setIsModalOpenRequirements}
        setIsCurrentFormValid={setIsCurrentFormValid}
        handleNextStep={handleNextStep}
        handlePreviousStep={handlePreviousStep}
        getAllDataRuleByName={getAllDataRuleByName}
        getRuleByName={getRuleByName}
        setCurrentStep={setCurrentStep}
        currentStepsNumber={currentStepsNumber}
        dataHeader={dataHeader}
        handleSubmitClick={handleSubmitClick}
        formData={formData}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        setIsCapacityAnalysisModal={setIsCapacityAnalysisModal}
        isCapacityAnalysisModal={isCapacityAnalysisModal}
        handleFormDataChange={handleFormDataChange}
        handleConsolidatedCreditChange={handleConsolidatedCreditChange}
        isMobile={isMobile}
        isTablet={isTablet}
        creditLineTerms={creditLineTerms}
      />
      {showConsultingModal && <Consulting />}
    </>
  );
}
