import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@inubekit/inubekit";

import { Consulting } from "@components/modals/Consulting";
import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";
import { getMonthsElapsed } from "@utils/formatData/currency";
import { postBusinessUnitRules } from "@services/businessUnitRules/EvaluteRuleByBusinessUnit";
import { postSimulateCredit } from "@services/prospect/simulateCredit";
import { IPaymentChannel } from "@services/creditRequest/types";
import { getCreditLimit } from "@services/creditLimit/getCreditLimit";
import { getClientPortfolioObligationsById } from "@services/creditRequest/getClientPortfolioObligations";
import { IObligations } from "@services/creditRequest/types";
import { getCreditPayments } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment";
import { IPayment } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";
import {
  IPaymentCapacity,
  IPaymentCapacityResponse,
  IIncomeSources,
} from "@services/creditLimit/types";
import { getBorrowerPaymentCapacityById } from "@services/creditLimit/getBorrowePaymentCapacity";

import { IProspect } from "@services/prospect/types";
import { getLinesOfCreditByMoneyDestination } from "@services/lineOfCredit/getLinesOfCreditByMoneyDestination";
import { getFinancialObligationsUpdate } from "@services/lineOfCredit/getFinancialObligationsUpdate";
import { getAdditionalBorrowersAllowed } from "@services/lineOfCredit/getAdditionalBorrowersAllowed";
import { getExtraInstallmentsAllowed } from "@services/lineOfCredit/getExtraInstallmentsAllowed";
import { patchValidateRequirements } from "@services/requirement/validateRequirements";
import { IValidateRequirement } from "@services/requirement/types";

import { stepsAddProspect } from "./config/addProspect.config";
import {
  IFormData,
  IServicesProductSelection,
  titleButtonTextAssited,
} from "./types";
import { SimulateCreditUI } from "./interface";
import { ruleConfig } from "./config/configRules";
import { evaluateRule } from "./evaluateRule";
import { createMainBorrowerFromFormData } from "./steps/extraDebtors/utils";

export function SimulateCredit() {
  const [currentStep, setCurrentStep] = useState<number>(
    6
  );
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(true);
  const [showConsultingModal, setShowConsultingModal] = useState(false);
  const [isAlertIncome, setIsAlertIncome] = useState(false);
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
  const [paymentCapacity, setPaymentCapacity] =
    useState<IPaymentCapacityResponse | null>(null);
  const [codeError, setCodeError] = useState<number | null>(null);
  const [addToFix, setAddToFix] = useState<string[]>([]);
  const [obligationPayment, setObligationPayment] = useState<IPayment[] | null>(
    null,
  );
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [validateRequirements, setValidateRequirements] = useState<
    IValidateRequirement[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [servicesProductSelection, setServicesProductSelection] = useState<{
    financialObligation: string[];
    aditionalBorrowers: string[];
    extraInstallement: string[];
  } | null>({
    financialObligation: [""],
    aditionalBorrowers: [""],
    extraInstallement: [""],
  });

  const isMobile = useMediaQuery("(max-width:880px)");
  const isTablet = useMediaQuery("(max-width: 1482px)");

  const steps = Object.values(stepsAddProspect);
  const navigate = useNavigate();

  const { customerData } = useContext(CustomerContext);
  const { businessUnitSigla } = useContext(AppContext);
  const customerPublicCode: string = customerData.publicCode;

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
      borrowers: [],
    },
    extraordinaryInstallments: [],
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
    sourcesOfIncome: {
      Dividends: 0,
      FinancialIncome: 0,
      Leases: 4444,
      OtherNonSalaryEmoluments: 0,
      PensionAllowances: 0,
      PeriodicSalary: 0,
      PersonalBusinessUtilities: 0,
      ProfessionalFees: 0,
      identificationNumber: "",
      identificationType: "",
      name: "",
      surname: "",
    },
  });

  const onlyBorrowerData = {
    borrowerIdentificationType:
      customerData.generalAttributeClientNaturalPersons[0].typeIdentification,
    borrowerIdentificationNumber: customerData.publicCode,
    borrowerType: "MainBorrower",
    borrowerName: "Lenis Poveda",
    borrowerProperties: [
      {
        propertyName: "PeriodicSalary",
        propertyValue: "4500000",
      },
    ],
  };
  const simulateData: IProspect = {
    borrowers: formData.borrowerData.borrowers,
    consolidatedCredits:
      Array.isArray(formData.consolidatedCreditArray) &&
        formData.consolidatedCreditArray.length > 0
        ? formData.consolidatedCreditArray.map((item) => ({
          borrowerIdentificationNumber:
            onlyBorrowerData.borrowerIdentificationNumber,
          borrowerIdentificationType:
            onlyBorrowerData.borrowerIdentificationType,
          consolidatedAmount: item.consolidatedAmount,
          consolidatedAmountType: item.consolidatedAmountType,
          creditProductCode: item.creditProductCode,
          estimatedDateOfConsolidation: item.estimatedDateOfConsolidation,
          lineOfCreditDescription: item.lineOfCreditDescription,
        }))
        : [],
    linesOfCredit: formData.selectedProducts.map((product) => ({
      lineOfCreditAbbreviatedName: product,
    })),
    firstPaymentCycleDate: new Date().toISOString().split("T")[0],
    extraordinaryInstallments: Array.isArray(formData.extraordinaryInstallments)
      ? formData.extraordinaryInstallments.map((item) => ({
        installmentAmount: item.value as number,
        installmentDate: item.datePayment as string | Date,
        paymentChannelAbbreviatedName: item.paymentMethod as string,
      }))
      : [],
    installmentLimit: formData.loanConditionState.quotaCapValue || 999999999999,
    moneyDestinationAbbreviatedName: formData.selectedDestination,
    preferredPaymentChannelAbbreviatedName:
      formData.loanAmountState.paymentPlan || "",
    selectedRegularPaymentSchedule: formData.loanAmountState.payAmount || "",
    requestedAmount: formData.loanAmountState.inputValue,
    termLimit: formData.loanConditionState.maximumTermValue || 999999999999,
    prospectId: "",
    prospectCode: "",
    state: "",
    selectedRateType: "",
    gracePeriod: 0,
    gracePeriodType: "",
    bondValue: 0,
    creditProducts: [],
    outlays: [],
    creditScore: "",
    modifyJustification: "",
    clientManagerIdentificationNumber: "",
    clientManagerName: "",
    clientManagerObservation: "",
  };

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [creditLineTerms, setCreditLineTerms] = useState<{
    [lineName: string]: {
      LoanAmountLimit: number;
      LoanTermLimit: number;
      RiskFreeInterestRate: number;
    };
  }>({});

  type RuleEvaluationResult = {
    value: number | string;
    [key: string]: string | number;
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

    const lineOfCreditValues = await getLinesOfCreditByMoneyDestination(
      businessUnitPublicCode,
      formData.selectedDestination,
    );

    type LineOfCreditValue = string | { value: string } | null | undefined;
    const lineNames = Array.isArray(lineOfCreditValues)
      ? (lineOfCreditValues as LineOfCreditValue[])
        .map((v) => (typeof v === "string" ? v : v?.value || ""))
        .filter((name): name is string => Boolean(name))
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

  const fetchRulesByProducts = useCallback(async () => {
    if (!formData.selectedProducts || formData.selectedProducts.length === 0)
      return;

    try {
      const results = await Promise.all(
        formData.selectedProducts.map(async (product) => {
          const [financial, borrowers, extra] = await Promise.all([
            getFinancialObligationsUpdate(
              businessUnitPublicCode,
              product,
              customerData.publicCode,
            ),
            getAdditionalBorrowersAllowed(
              businessUnitPublicCode,
              product,
              customerData.publicCode,
            ),
            getExtraInstallmentsAllowed(
              businessUnitPublicCode,
              product,
              customerData.publicCode,
            ),
          ]);

          return {
            product,
            financialObligation:
              financial?.financialObligationsUpdateRequired ?? "N",
            aditionalBorrowers: borrowers?.additionalBorowersAllowed ?? "N",
            extraInstallement: extra?.extraInstallmentsAllowed ?? "N",
          };
        }),
      );

      setServicesProductSelection({
        financialObligation: results.map(
          (result) => result.financialObligation,
        ),
        aditionalBorrowers: results.map((result) => result.aditionalBorrowers),
        extraInstallement: results.map((result) => result.extraInstallement),
      });
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");
      setShowErrorModal(true);
      setMessageError(description);
    }
  }, [formData.selectedProducts]);

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
      setShowErrorModal(true);
      setMessageError(description);
    }
  };

  const fetchCapacityAnalysis = async () => {
    if (!customerPublicCode) {
      return;
    }
    const data: IPaymentCapacity = {
      clientIdentificationNumber: "16378491",
      dividends: 0,
      financialIncome: 0,
      leases: 0,
      otherNonSalaryEmoluments: 0,
      pensionAllowances: 0,
      periodicSalary: 0,
      personalBusinessUtilities: 0,
      professionalFees: 0,
      livingExpenseToIncomeRatio: 0,
    };

    try {
      const paymentCapacity = await getBorrowerPaymentCapacityById(
        businessUnitPublicCode,
        data,
      );
      setPaymentCapacity(paymentCapacity ?? null);
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");
      setShowErrorModal(true);
      setMessageError(description);
    }
  };

  const fetchDataObligationPayment = async () => {
    if (!customerPublicCode) {
      return;
    }
    try {
      const data = await getCreditPayments(
        customerPublicCode,
        businessUnitPublicCode,
      );
      setObligationPayment(data ?? null);
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");
      setShowErrorModal(true);
      setMessageError(description);
    }
  };

  useEffect(() => {
    if (customerData) {
      fetchCreditLineTerms();
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
    newValue: string | number | boolean | string[] | object | null | undefined,
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
    const { togglesState } = formData;
    const dynamicSteps = [
      togglesState[0]
        ? stepsAddProspect.extraordinaryInstallments.id
        : undefined,
      stepsAddProspect.sourcesIncome.id,
      togglesState[1] ? stepsAddProspect.obligationsFinancial.id : undefined,
      togglesState[2] ? stepsAddProspect.extraBorrowers.id : undefined,
      stepsAddProspect.loanConditions.id,
      stepsAddProspect.loanAmount.id,
      formData.loanAmountState.toggleChecked
        ? stepsAddProspect.obligationsCollected.id
        : undefined,
    ].filter((step): step is number => step !== undefined);

    const currentStepIndex = dynamicSteps.indexOf(currentStep);

    if (
      currentStep === stepsAddProspect.loanAmount.id &&
      !formData.loanAmountState.toggleChecked
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
      stepsAddProspect.sourcesIncome.id,
      togglesState[1] ? stepsAddProspect.obligationsFinancial.id : undefined,
      togglesState[2] ? stepsAddProspect.extraBorrowers.id : undefined,
      stepsAddProspect.loanConditions.id,
      stepsAddProspect.loanAmount.id,
      formData.loanAmountState.toggleChecked
        ? stepsAddProspect.obligationsCollected.id
        : undefined,
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

  const handleFlag = (error: string) => {
    setShowErrorModal(true);
    setMessageError(error);
  };

  const handleSubmitClick = async () => {
    try {
      const response = await postSimulateCredit(
        businessUnitPublicCode,
        simulateData,
      );
      const prospectCode = response?.prospectCode;

      setTimeout(() => {
        navigate(`/credit/prospects/${prospectCode}`);
      }, 1000);
    } catch (error) {
      handleFlag(error as string);
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
        customerPublicCode,
      );
      setCreditLimitData(result);
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");
      setShowErrorModal?.(true);
      setMessageError?.(description);
    }
  };
  useEffect(() => {
    if (currentStep === stepsAddProspect.productSelection.id) {
      fetchCreditLimit();
      fetchDataClientPortfolio();
      fetchDataObligationPayment();
      fetchCapacityAnalysis();
    }
  }, [currentStep]);

  useEffect(() => {
    if (!customerData?.customerId || !simulateData) return;

    const payload = {
      clientIdentificationNumber: customerData.customerId,
      prospect: { ...simulateData },
    };

    const handleSubmit = async () => {
      try {
        const data = await patchValidateRequirements(
          businessUnitPublicCode,
          payload,
        );
        if (data) {
          setValidateRequirements(data);
        }
      } catch (error) {
        /* setShowErrorModal(true); */
      } finally {
        setIsLoading(false);
      }
    };

    handleSubmit();
  }, [customerData, simulateData]);

  useEffect(() => {
    if (clientPortfolio) {
      setFormData((prevState) => ({
        ...prevState,
        obligationsFinancial: clientPortfolio,
      }));
    }
  }, [clientPortfolio]);

  useEffect(() => {
    fetchRulesByProducts();
  }, [formData.selectedProducts, fetchRulesByProducts]);

  useEffect(() => {
    const isExtraBorrowersStep = currentStepsNumber?.id === stepsAddProspect.extraBorrowers.id;

    if (isExtraBorrowersStep) {
      const newMainBorrower = createMainBorrowerFromFormData(formData, customerData);

      const currentMainBorrower = formData.borrowerData.borrowers.find(
        (b) => b.borrowerType === "MainBorrower"
      );

      if (JSON.stringify(currentMainBorrower) === JSON.stringify(newMainBorrower)) {
        return;
      }

      const otherBorrowers = formData.borrowerData.borrowers.filter(
        (b) => b.borrowerType !== "MainBorrower"
      );

      const existMainBorrower = formData.borrowerData.borrowers.filter(
        (b) => b.borrowerType === "MainBorrower"
      );

      let keepBeforeChanges = newMainBorrower;

      if (existMainBorrower.length > 0) {
        keepBeforeChanges = {
          ...existMainBorrower[0],
          ...newMainBorrower.borrowerProperties

        }
      }

      const updatedBorrowers = [keepBeforeChanges, ...otherBorrowers];

      handleFormDataChange("borrowerData", { borrowers: updatedBorrowers });
    }
  }, [currentStepsNumber, customerData]);

  useEffect(() => {
    const mainBorrower = formData.borrowerData.borrowers.find(
      (b) => b.borrowerType === "MainBorrower"
    );

    if (!mainBorrower) {
      return;
    }

    const incomeProperties: { [key: string]: number } = {};
    mainBorrower.borrowerProperties.forEach((prop) => {
      const incomeKeys = [
        "Dividends", "FinancialIncome", "Leases", "OtherNonSalaryEmoluments",
        "PensionAllowances", "PeriodicSalary", "PersonalBusinessUtilities", "ProfessionalFees",
      ];
      if (incomeKeys.includes(prop.propertyName)) {
        incomeProperties[prop.propertyName] = Number(prop.propertyValue) || 0;
      }
    });

    const newSourcesOfIncome = {
      ...formData.sourcesOfIncome,
      ...incomeProperties,
    };

    if (JSON.stringify(formData.sourcesOfIncome) !== JSON.stringify(newSourcesOfIncome)) {
      handleFormDataChange("sourcesOfIncome", newSourcesOfIncome);
    }
  }, [formData.borrowerData.borrowers]);
  console.log("formData: ",formData);
  console.log("CustomerData: ",customerData);
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
        setCurrentStep={setCurrentStep}
        setIsCreditLimitWarning={setIsCreditLimitWarning}
        isCreditLimitWarning={isCreditLimitWarning}
        currentStepsNumber={currentStepsNumber}
        dataHeader={dataHeader}
        handleSubmitClick={handleSubmitClick}
        formData={formData}
        selectedProducts={selectedProducts}
        prospectData={simulateData as IProspect}
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
        setShowErrorModal={setShowErrorModal}
        creditLineTerms={creditLineTerms}
        clientPortfolio={clientPortfolio as IObligations}
        obligationPayments={obligationPayment as IPayment[]}
        assistedButtonText={assistedButtonText}
        isAlertIncome={isAlertIncome}
        setIsAlertIncome={setIsAlertIncome}
        validateRequirements={validateRequirements}
        isLoading={isLoading}
        codeError={codeError}
        addToFix={addToFix}
        navigate={navigate}
        formState={formState}
        setFormState={setFormState}
        servicesProductSelection={
          servicesProductSelection as IServicesProductSelection
        }
        paymentCapacity={paymentCapacity}
        showErrorModal={showErrorModal}
        messageError={messageError}
        businessUnitPublicCode={businessUnitPublicCode}
      />
      {showConsultingModal && <Consulting />}
    </>
  );
}
