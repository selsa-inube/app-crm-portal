import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFlag, useMediaQuery } from "@inubekit/inubekit";

import { Consulting } from "@components/modals/Consulting";
import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";
import { getMonthsElapsed } from "@utils/formatData/currency";
import { postBusinessUnitRules } from "@services/businessUnitRules";
import { postSimulateCredit } from "@services/iProspect/simulateCredit";
import { IPaymentChannel } from "@services/types";
import { IIncomeSources } from "@services/incomeSources/types";
import { getCreditLimit } from "@services/creditRequest/getCreditLimit";

import { stepsAddProspect } from "./config/addProspect.config";
import { IFormData } from "./types";
import { AddProspectUI } from "./interface";
import { ruleConfig } from "./config/configRules";
import { evaluateRule } from "./evaluateRule";
import { textAddCongfig } from "./config/addConfig";

export function AddProspect() {
  const [currentStep, setCurrentStep] = useState<number>(
    stepsAddProspect.generalInformation.id,
  );
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(true);
  const [showConsultingModal, setShowConsultingModal] = useState(false);
  const [isModalOpenRequirements, setIsModalOpenRequirements] = useState(false);
  const [isCreditLimitModalOpen, setIsCreditLimitModalOpen] = useState(false);
  const [isCreditLimitWarning, setIsCreditLimitWarning] = useState(false);
  const [isCapacityAnalysisModal, setIsCapacityAnalysisModal] = useState(false);
  const [isCapacityAnalysisWarning, setIsCapacityAnalysisWarning] =
    useState(false);
  const [creditLimitData, setCreditLimitData] = useState<IIncomeSources>();
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
      borrowers: {},
    },
    loanAmountState: {
      inputValue: "",
      toggleChecked: false,
      paymentPlan: "",
      periodicity: "",
      payAmount: "",
    },
    consolidatedCreditSelections: {
      title: "",
      code: "",
      label: "",
      value: 0,
      totalCollected: 0,
      selectedValues: {},
    },
  });

  const onlyBorrowerData = {
    borrowerIdentificationType:
      customerData.generalAttributeClientNaturalPersons[0].typeIdentification,
    borrowerIdentificationNumber: customerData.publicCode,
    borrowerType: "MainBorrower",
    borrowerName: "Lenis Poveda", // borrar en un futuro
    borrowerProperties: [
      {
        propertyName: "PeriodicSalary",
        propertyValue: "4500000",
      },
    ],
  };

  const simulateData = {
    borrowers: [
      Object.keys(formData.borrowerData.borrowers).length === 0
        ? onlyBorrowerData
        : formData.borrowerData.borrowers,
    ],
    consolidatedCredits:
      Array.isArray(formData.consolidatedCreditArray) &&
      formData.consolidatedCreditArray.length > 0
        ? formData.consolidatedCreditArray.map((item) => ({
            borrowerIdentificationNumber:
              onlyBorrowerData.borrowerIdentificationNumber,
            borrowerIdentificationType:
              onlyBorrowerData.borrowerIdentificationType,
            consolidatedAmount: item.value,
            consolidatedAmountType: item.label,
            creditProductCode: item.code,
            estimatedDateOfConsolidation: "2025-06-12T15:04:05Z", // borrar en un futuro
            lineOfCreditDescription: item.title,
          }))
        : [],
    linesOfCredit: formData.selectedProducts.map((product) => ({
      lineOfCreditAbbreviatedName: product,
    })),
    firstPaymentCycleDate: "2025-06-15T15:04:05Z",
    extraordinaryInstallments: [
      {
        installmentAmount: 1,
        installmentDate: "2025-06-12T15:04:05Z",
        paymentChannelAbbreviatedName: "",
      },
    ],
    installmentLimit: formData.loanConditionState.quotaCapValue || 999999999999,
    moneyDestinationAbbreviatedName: formData.selectedDestination,
    preferredPaymentChannelAbbreviatedName:
      formData.loanAmountState.paymentPlan || "",
    selectedRegularPaymentSchedule: formData.loanAmountState.payAmount || "",
    requestedAmount: formData.loanAmountState.inputValue,
    termLimit: formData.loanConditionState.maximumTermValue || 999999999999,
  };

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

    let products = formData.selectedProducts;
    if (!products || products.length === 0) {
      const lineOfCreditRule = ruleConfig["LineOfCredit"]?.({
        ...dataRulesBase,
        LineOfCredit: "",
      });
      if (lineOfCreditRule) {
        const lineOfCreditValues = await evaluateRule(
          lineOfCreditRule,
          postBusinessUnitRules,
          "value",
          businessUnitPublicCode,
          true,
        );
        if (Array.isArray(lineOfCreditValues)) {
          products = lineOfCreditValues
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((v: any) =>
              typeof v === "string"
                ? v
                : v && typeof v === "object" && "value" in v
                  ? v.value
                  : "",
            )
            .filter(Boolean);
        } else {
          products = [""];
        }
      } else {
        products = [""];
      }
    }

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

  useEffect(() => {
    if (formData.generalToggleChecked) {
      setSelectedProducts([]);
      setFormData((prev) => ({ ...prev, selectedProducts: [] }));
    }
  }, [formData.generalToggleChecked]);

  const handleFormDataChange = (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newValue: string | number | boolean | any[],
  ) => {
    setFormData((prevState) => ({ ...prevState, [field]: newValue }));
  };

  const totalIncome =
    (creditLimitData?.Dividends ?? 0) +
    (creditLimitData?.FinancialIncome ?? 0) +
    (creditLimitData?.Leases ?? 0) +
    (creditLimitData?.OtherNonSalaryEmoluments ?? 0) +
    (creditLimitData?.PensionAllowances ?? 0) +
    (creditLimitData?.PeriodicSalary ?? 0) +
    (creditLimitData?.PersonalBusinessUtilities ?? 0) +
    (creditLimitData?.ProfessionalFees ?? 0);

  const totalObligations = // modificar cuando se integre obligations
    (creditLimitData?.PeriodicSalary ?? 0) +
    (creditLimitData?.PersonalBusinessUtilities ?? 0) +
    (creditLimitData?.ProfessionalFees ?? 0);

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

    const showSourcesIncome = togglesState[1] || totalIncome === 0;
    const showObligations = togglesState[2] || totalObligations === 0;

    const dynamicSteps = [
      togglesState[0]
        ? stepsAddProspect.extraordinaryInstallments.id
        : undefined,
      togglesState[3] ? stepsAddProspect.extraBorrowers.id : undefined,
      ...[
        !(isInExtraBorrowersStep && totalIncome !== 0) && showSourcesIncome
          ? stepsAddProspect.sourcesIncome.id
          : undefined,
        !(isInExtraBorrowersStep && totalObligations !== 0) && showObligations
          ? stepsAddProspect.obligationsFinancial.id
          : undefined,
      ],
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

    const showSourcesIncome = togglesState[1] || totalIncome === 0;
    const showObligations = togglesState[2] || totalObligations === 0;

    const dynamicSteps = [
      togglesState[0]
        ? stepsAddProspect.extraordinaryInstallments.id
        : undefined,
      togglesState[3] ? stepsAddProspect.extraBorrowers.id : undefined,
      ...[
        !(nextStepWouldBeExtraBorrowers && totalIncome !== 0) &&
        showSourcesIncome
          ? stepsAddProspect.sourcesIncome.id
          : undefined,
        !(nextStepWouldBeExtraBorrowers && totalObligations !== 0) &&
        showObligations
          ? stepsAddProspect.obligationsFinancial.id
          : undefined,
      ],
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

  const { addFlag } = useFlag();

  const handleFlag = (error: unknown) => {
    addFlag({
      title: textAddCongfig.errorPost,
      description: `${error}`,
      appearance: "danger",
      duration: 5000,
    });
  };

  const handleSubmitClick = async () => {
    try {
      const response = await postSimulateCredit(
        businessUnitPublicCode,
        simulateData,
      );
      const prospectCode = response.prospectCode;

      setTimeout(() => {
        navigate(`/credit/edit-prospect/${customerPublicCode}/${prospectCode}`);
      }, 1000);
    } catch (error) {
      handleFlag(error);
    }
  };

  const showConsultingForFiveSeconds = () => {
    setShowConsultingModal(true);
    setTimeout(() => {
      setShowConsultingModal(false);
    }, 2000);
  };

  const fetchCreditLimit = async () => {
    try {
      const result = await getCreditLimit(
        businessUnitPublicCode,
        customerPublicCode!,
      );
      setCreditLimitData(result);
    } catch (error) {
      handleFlag(error);
    }
  };

  useEffect(() => {
    if (currentStep === stepsAddProspect.productSelection.id) {
      fetchCreditLimit();
    }
  }, [currentStep]);

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
        setIsCreditLimitWarning={setIsCreditLimitWarning}
        isCreditLimitWarning={isCreditLimitWarning}
        currentStepsNumber={currentStepsNumber}
        dataHeader={dataHeader}
        handleSubmitClick={handleSubmitClick}
        formData={formData}
        selectedProducts={selectedProducts}
        prospectData={simulateData}
        setSelectedProducts={setSelectedProducts}
        setIsCapacityAnalysisModal={setIsCapacityAnalysisModal}
        isCapacityAnalysisModal={isCapacityAnalysisModal}
        handleFormDataChange={handleFormDataChange}
        isMobile={isMobile}
        isTablet={isTablet}
        creditLimitData={creditLimitData}
        totalIncome={totalIncome}
        isCapacityAnalysisWarning={isCapacityAnalysisWarning}
        setIsCapacityAnalysisWarning={setIsCapacityAnalysisWarning}
      />
      {showConsultingModal && <Consulting />}
    </>
  );
}
