import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery, useFlag } from "@inubekit/inubekit";

import { Consulting } from "@components/modals/Consulting";
import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";
import { getMonthsElapsed } from "@utils/formatData/currency";
import { postBusinessUnitRules } from "@services/businessUnitRules";
import { postSimulateCredit } from "@services/iProspect/simulateCredit";
import { IPaymentChannel } from "@services/types";
import { IIncomeSources } from "@services/incomeSources/types";
import { getCreditLimit } from "@services/creditRequest/getCreditLimit";
import { getClientPortfolioObligationsById } from "@services/creditLimit/getClientPortfolioObligations";
import { IObligations } from "@services/creditLimit/getClientPortfolioObligations/types";

import { stepsAddProspect } from "./config/addProspect.config";
import { IFormData, RuleValue, titleButtonTextAssited } from "./types";
import { SimulateCreditUI } from "./interface";
import { ruleConfig } from "./config/configRules";
import { evaluateRule } from "./evaluateRule";
import { textAddCongfig } from "./config/addConfig";
import { tittleOptions } from "./steps/financialObligations/config/config";

export function SimulateCredit() {
  const [currentStep, setCurrentStep] = useState<number>(
    stepsAddProspect.generalInformation.id,
  );
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(true);
  const [showConsultingModal, setShowConsultingModal] = useState(false);
  const [isAlertIncome, setIsAlertIncome] = useState(false);
  const [isAlertObligation, setIsAlertObligation] = useState(false);
  const [isModalOpenRequirements, setIsModalOpenRequirements] = useState(false);
  const [isCreditLimitModalOpen, setIsCreditLimitModalOpen] = useState(false);
  const [isCreditLimitWarning, setIsCreditLimitWarning] = useState(false);
  const [isCapacityAnalysisModal, setIsCapacityAnalysisModal] = useState(false);
  const [isCapacityAnalysisWarning, setIsCapacityAnalysisWarning] =
    useState(false);
  const [creditLimitData, setCreditLimitData] = useState<IIncomeSources>();
  const [requestValue, setRequestValue] = useState<IPaymentChannel[]>();
  const [clientPortfolio, setClientPortfolio] = useState<IObligations | null>(
    null,
  );
  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);

  const isMobile = useMediaQuery("(max-width:880px)");
  const isTablet = useMediaQuery("(max-width: 1482px)");
  const { addFlag } = useFlag();

  const steps = Object.values(stepsAddProspect);
  const navigate = useNavigate();

  const { customerData } = useContext(CustomerContext);
  const { businessUnitSigla } = useContext(AppContext);
  const { customerPublicCode } = useParams();
  const [formState, setFormState] = useState({
    type: "",
    entity: "",
    fee: "",
    balance: "",
    payment: "",
    feePaid: "",
    term: "",
    idUser: "",
  });

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
    obligationsFinancial: clientPortfolio,
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
        paymentChannelAbbreviatedName: "none",
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
    if (customerData.fullName.length === 0) {
      setCodeError(1016);
      setAddToFix(["No se ha seleccionado ningún cliente "]);
    } else {
      setCodeError(null);
    }
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

    const normalizeValues = (values: RuleValue[] | RuleValue): string[] => {
      if (Array.isArray(values)) {
        return values
          .map((v) => {
            if (typeof v === "string") return v;
            if (v && typeof v === "object" && "value" in v) return v.value;
            return "";
          })
          .filter(Boolean);
      }

      if (typeof values === "string") return [values];
      if (values && typeof values === "object" && "value" in values)
        return [values.value];
      return [];
    };

    let linesToProcess: string[] = [];

    if (formData.selectedProducts && formData.selectedProducts.length > 0) {
      linesToProcess = [...formData.selectedProducts];
    } else {
      const lineOfCreditRule = ruleConfig["LineOfCredit"]?.(baseDataRules);
      const lineOfCreditValues: RuleValue[] | RuleValue = lineOfCreditRule
        ? await evaluateRule(
            lineOfCreditRule,
            postBusinessUnitRules,
            "value",
            businessUnitPublicCode,
            true,
          )
        : [];

      linesToProcess = normalizeValues(lineOfCreditValues);
    }

    const rulesToValidate = [
      "PercentagePayableViaExtraInstallments",
      "IncomeSourceUpdateAllowed",
    ];

    const ruleResults: { [ruleName: string]: string[] } = {};

    await Promise.all(
      linesToProcess.map(async (lineOfCredit) => {
        const productData = { ...baseDataRules, LineOfCredit: lineOfCredit };

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

            const normalizedResult = normalizeValues(result);

            normalizedResult.forEach((value) => {
              if (value) {
                if (!ruleResults[ruleName]) {
                  ruleResults[ruleName] = [value];
                } else if (!ruleResults[ruleName].includes(value)) {
                  ruleResults[ruleName].push(value);
                }
              }
            });
          }),
        );
      }),
    );

    setValueRule(ruleResults);
  }, [
    customerData,
    businessUnitPublicCode,
    formData.selectedDestination,
    formData.selectedProducts,
  ]);

  const fetchDataClientPortfolio = async () => {
    if (!customerPublicCode) {
      return;
    }
    try {
      const data = await getClientPortfolioObligationsById(
        businessUnitPublicCode,
        customerPublicCode,
      );
      setClientPortfolio(data);
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");
      addFlag({
        title: tittleOptions.titleError,
        description,
        appearance: "danger",
        duration: 5000,
      });
    }
  };

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

  const totalObligations = clientPortfolio?.obligations;

  useEffect(() => {
    if (currentStep === stepsAddProspect.productSelection.id) {
      setFormData((prevState) => ({
        ...prevState,
        togglesState: [false, false, false, false],
      }));
    }
    if (currentStep === stepsAddProspect.destination.id) {
      setFormData((prevState) => ({
        ...prevState,
        selectedProducts: [],
      }));
    }
  }, [currentStep]);

  const currentStepsNumber = steps.find(
    (step: { number: number }) => step.number === currentStep,
  );

  const handleNextStep = () => {
    const { togglesState, loanAmountState } = formData;

    const isInExtraBorrowersStep =
      currentStep === stepsAddProspect.extraBorrowers.id;

    const showSourcesIncome = togglesState[1] || totalIncome === 0;
    const showObligations = togglesState[2] || totalObligations === undefined;

    const dynamicSteps = [
      togglesState[0]
        ? stepsAddProspect.extraordinaryInstallments.id
        : undefined,
      togglesState[3] ? stepsAddProspect.extraBorrowers.id : undefined,
      ...[
        !(isInExtraBorrowersStep && totalIncome !== 0) && showSourcesIncome
          ? stepsAddProspect.sourcesIncome.id
          : undefined,
        !(isInExtraBorrowersStep && totalObligations !== undefined) &&
        showObligations
          ? stepsAddProspect.obligationsFinancial.id
          : undefined,
      ],
      stepsAddProspect.loanConditions.id,
      stepsAddProspect.loanAmount.id,
      loanAmountState.toggleChecked
        ? stepsAddProspect.obligationsCollected.id
        : undefined,
    ].filter((step): step is number => step !== undefined);

    const currentStepIndex = dynamicSteps.indexOf(currentStep);

    if (
      currentStep === stepsAddProspect.loanAmount.id &&
      !loanAmountState.toggleChecked
    ) {
      handleSubmitClick();
      return;
    }
    if (currentStep === stepsAddProspect.loanConditions.id) {
      showConsultingForFiveSeconds();
    }
    if (
      currentStep === stepsAddProspect.sourcesIncome.id &&
      totalIncome === 0
    ) {
      setIsAlertIncome(true);
      return;
    }
    if (currentStep === stepsAddProspect.sourcesIncome.id) {
      setCurrentStep(stepsAddProspect.obligationsFinancial.id);
      return;
    }
    if (
      currentStep === stepsAddProspect.obligationsFinancial.id &&
      totalObligations === undefined
    ) {
      setIsAlertObligation(true);
      return;
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
    const showObligations = togglesState[2] || totalObligations === undefined;

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
        !(nextStepWouldBeExtraBorrowers && totalObligations !== undefined) &&
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

  const assistedButtonText =
    (currentStep === stepsAddProspect.loanAmount.id &&
      !formData.loanAmountState.toggleChecked) ||
    currentStep === steps[steps.length - 1].id
      ? titleButtonTextAssited.submitText
      : titleButtonTextAssited.goNextText;

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
      fetchDataClientPortfolio();
    }
  }, [currentStep]);

  useEffect(() => {
    if (clientPortfolio) {
      setFormData((prevState) => ({
        ...prevState,
        obligationsFinancial: clientPortfolio,
      }));
    }
  }, [clientPortfolio]);

  return (
    <>
      <SimulateCreditUI
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
        creditLineTerms={creditLineTerms}
        clientPortfolio={clientPortfolio as IObligations}
        assistedButtonText={assistedButtonText}
        isAlertIncome={isAlertIncome}
        isAlertObligation={isAlertObligation}
        setIsAlertIncome={setIsAlertIncome}
        setIsAlertObligation={setIsAlertObligation}
        codeError={codeError}
        addToFix={addToFix}
        navigate={navigate}
        formState={formState}
        setFormState={setFormState}
      />
      {showConsultingModal && <Consulting />}
    </>
  );
}
