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

  const getRuleByName = useCallback(
    (ruleName: string) => {
      const raw = valueRule?.[ruleName] || [];
      return (
        raw
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanConditions = (rule: any) => {
    if (!rule) return rule;

    const cleaned = { ...rule };

    if (Array.isArray(cleaned.conditions)) {
      const hasValidCondition = cleaned.conditions.some(
        (c: { value: unknown }) =>
          c.value !== undefined && c.value !== null && c.value !== "",
      );
      if (!hasValidCondition) {
        delete cleaned.conditions;
      }
    }
    return cleaned;
  };

  const fetchValidationRules = useCallback(async () => {
    const rulesToCheck = [
      "LineOfCredit",
      "PercentagePayableViaExtraInstallments",
      "IncomeSourceUpdateAllowed",
    ];
    const notDefinedRules: string[] = [];
    await Promise.all(
      rulesToCheck.map(async (ruleName) => {
        try {
          const rule = cleanConditions(ruleConfig[ruleName]?.({}));
          if (!rule) return notDefinedRules.push(ruleName);
          await evaluateRule(
            rule,
            postBusinessUnitRules,
            "value",
            businessUnitPublicCode,
            true,
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error?.response?.status === 400) notDefinedRules.push(ruleName);
        }
      }),
    );

    if (notDefinedRules.length >= 1) {
      console.log("a");
    }
  }, [businessUnitPublicCode]);

  useEffect(() => {
    if (!customerData) return;
    fetchValidationRules();
  }, [customerData, fetchValidationRules]);

  const fetchValidationRulesData = useCallback(async () => {
    const clientInfo = customerData?.generalAttributeClientNaturalPersons?.[0];

    if (!clientInfo?.associateType) return;

    const dataRulesBase = {
      MoneyDestination: formData.selectedDestination,
      ClientType: clientInfo.associateType?.substring(0, 1) || "",
      EmploymentContractTermType:
        clientInfo.employmentType?.substring(0, 2) || "",
      AffiliateSeniority: getMonthsElapsed(
        customerData.generalAssociateAttributes?.[0]?.affiliateSeniorityDate,
        0,
      ),
    };

    const rulesValidate = [
      "LineOfCredit",
      "PercentagePayableViaExtraInstallments",
      "IncomeSourceUpdateAllowed",
    ];

    const products =
      formData.selectedProducts.length > 0 ? formData.selectedProducts : [""];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ruleResults: { [ruleName: string]: any[] } = {};

    await Promise.all(
      products.map(async (product) => {
        const dataRules = {
          ...dataRulesBase,
          LineOfCredit: product || "",
        };

        await Promise.all(
          rulesValidate.map(async (ruleName) => {
            const rule = ruleConfig[ruleName]?.(dataRules);
            if (!rule) return;

            try {
              const values = await evaluateRule(
                rule,
                postBusinessUnitRules,
                "value",
                businessUnitPublicCode,
                true,
              );

              if (!ruleResults[ruleName]) ruleResults[ruleName] = [];
              if (Array.isArray(values)) {
                ruleResults[ruleName].push(...values);
              } else if (values !== undefined) {
                ruleResults[ruleName].push(values);
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
              console.error(
                `Error evaluando ${ruleName} para producto`,
                product,
                error,
              );
            }
          }),
        );
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueRuleResults: { [ruleName: string]: any[] } = {};
    Object.keys(ruleResults).forEach((ruleName) => {
      const seen = new Set();
      uniqueRuleResults[ruleName] = ruleResults[ruleName].filter((item) => {
        const key = typeof item === "object" ? JSON.stringify(item) : item;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    });
    setValueRule((prev) => ({
      ...prev,
      ...uniqueRuleResults,
    }));
  }, [
    customerData,
    businessUnitPublicCode,
    formData.selectedDestination,
    formData.selectedProducts,
  ]);

  useEffect(() => {
    if (customerData) {
      fetchValidationRulesData();
    }
  }, [customerData, fetchValidationRulesData]);

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

    const dynamicSteps = [
      togglesState[0]
        ? stepsAddProspect.extraordinaryInstallments.id
        : undefined,
      togglesState[3] ? stepsAddProspect.extraBorrowers.id : undefined,
      togglesState[1] ? stepsAddProspect.sourcesIncome.id : undefined,
      togglesState[2] ? stepsAddProspect.obligationsFinancial.id : undefined,
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

    const dynamicSteps = [
      togglesState[0]
        ? stepsAddProspect.extraordinaryInstallments.id
        : undefined,
      togglesState[3] ? stepsAddProspect.extraBorrowers.id : undefined,
      togglesState[1] ? stepsAddProspect.sourcesIncome.id : undefined,
      togglesState[2] ? stepsAddProspect.obligationsFinancial.id : undefined,
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
        handleFormDataChange={handleFormDataChange}
        handleConsolidatedCreditChange={handleConsolidatedCreditChange}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      {showConsultingModal && <Consulting />}
    </>
  );
}
