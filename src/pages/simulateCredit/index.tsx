import {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useFlag } from "@inubekit/inubekit";
import { useIAuth } from "@inube/iauth-react";

import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";
import { ILinesOfCreditByMoneyDestination } from "@services/lineOfCredit/types";
import { postSimulateCredit } from "@services/prospect/simulateCredit";
import { IPaymentChannel } from "@services/creditRequest/types";
import { getCreditLimit } from "@services/creditLimit/getCreditLimit";
import { IObligations } from "@services/creditRequest/types";
import { getCreditPayments } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment";
import { IPayment } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";
import {
  IPaymentCapacity,
  IPaymentCapacityResponse,
  IIncomeSources,
} from "@services/creditLimit/types";
import { IBorrower } from "@services/prospect/types";
import { getBorrowerPaymentCapacityById } from "@services/creditLimit/getBorrowePaymentCapacity";
import { IProspect } from "@services/prospect/types";
import { getLinesOfCreditByMoneyDestination } from "@services/lineOfCredit/getLinesOfCreditByMoneyDestination";
import { getFinancialObligationsUpdate } from "@services/lineOfCredit/getFinancialObligationsUpdate";
import { getAdditionalBorrowersAllowed } from "@services/lineOfCredit/getAdditionalBorrowersAllowed";
import { getExtraInstallmentsAllowed } from "@services/lineOfCredit/getExtraInstallmentsAllowed";
import { patchValidateRequirements } from "@services/requirement/validateRequirements";
import { IValidateRequirement } from "@services/requirement/types";
import { GetSearchAllPaymentChannels } from "@services/payment-channels/SearchAllPaymentChannelsByIdentificationNumber";
import {
  IPaymentDatesChannel,
  IResponsePaymentDatesChannel,
} from "@services/payment-channels/SearchAllPaymentChannelsByIdentificationNumber/types";
import { useEnum } from "@hooks/useEnum/useEnum";
import { IAllEnumsResponse } from "@services/enumerators/types";
import { creditConsultationInBuroByIdentificationNumber } from "@services/creditRiskBureauQueries/creditConsultationInBuroByIdentificationNumber";
import { updateCreditRiskBureauQuery } from "@services/creditRiskBureauQueries/updateCreditRiskBureauQuery";
import { ICreditRiskBureauQuery } from "@services/creditRiskBureauQueries/types";
import { getUpdateMethodByCreditRiskBureauName } from "@services/creditRiskBureauQueries/getUpdateMethodByCreditRiskBureauName";
import {
  ICreditRiskBureauUpdateMethod,
  IUpdateCreditRiskBureauQuery,
} from "@services/creditRiskBureauQueries/types";

import { creditScoreChanges } from "../prospect/components/ScoreModalProspect/config";
import { stepsAddProspect } from "./config/addProspect.config";
import { getFinancialObligations } from "./steps/extraDebtors/utils";
import {
  IFormData,
  IServicesProductSelection,
  titleButtonTextAssited,
  IManageErrors,
} from "./types";
import { SimulateCreditUI } from "./interface";
import { messagesError } from "./config/config";
import {
  createMainBorrowerFromFormData,
  updateFinancialObligationsFormData,
} from "./steps/extraDebtors/utils";
import { IdataMaximumCreditLimitService } from "./components/CreditLimitCard/types";

export function SimulateCredit() {
  const { addFlag } = useFlag();

  const [currentStep, setCurrentStep] = useState<number>(
    stepsAddProspect.generalInformation.id,
  );
  const [errorsManager, setErrorsManager] = useState<IManageErrors>({});
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(true);
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
  const [paymentChannel, setPaymentChannel] = useState<
    IResponsePaymentDatesChannel[] | null
  >(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [allowToContinue, setAllowToContinue] = useState(true);
  const [validateRequirements, setValidateRequirements] = useState<
    IValidateRequirement[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCreditLimit, setIsLoadingCreditLimit] = useState(false);
  const [sentModal, setSentModal] = useState(false);
  const [createdProspectModal, setCreatedProspectModal] = useState(false);
  const [prospectCode, setProspectCode] = useState<string>("");
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [showRiskScoreStep, setShowRiskScoreStep] = useState(true);
  const [originalBureauData, setOriginalBureauData] = useState<
    ICreditRiskBureauQuery[]
  >([]);
  const [bureauMethods, setBureauMethods] = useState<
    ICreditRiskBureauUpdateMethod[]
  >([]);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
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

  const { lang, enums } = useEnum();

  const steps = useMemo(() => {
    return Object.values(stepsAddProspect).map((step) => ({
      ...step,
      name: step.name.i18n[lang],
      description: step.description.i18n[lang],
    }));
  }, [lang]);

  const navigate = useNavigate();

  const { user } = useIAuth();
  const { customerData } = useContext(CustomerContext);
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const userAccount = eventData.user.identificationDocumentNumber || "";
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

  const businessManagerCode = eventData.businessManager.publicCode;

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
      paymentCycle: "",
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
      Leases: 0,
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
    riskScores: [],
  });

  const onlyBorrowerData = useMemo(() => {
    const numericIncomeProperties = Object.entries(formData.sourcesOfIncome)
      .filter(([_, value]) => typeof value === "number" && !isNaN(value))
      .map(([key, value]) => ({
        propertyName: key,
        propertyValue: String(value),
      }));

    const financialObligationProperties =
      formData.obligationsFinancial?.obligations?.map((obligation) => ({
        propertyName: "FinancialObligation",
        propertyValue: [
          obligation.productName,
          obligation.nextPaymentValueTotal,
          obligation.balanceObligationTotal,
          obligation.entity,
          obligation.paymentMethodName,
          obligation.obligationNumber,
          obligation.duesPaid || "0",
          obligation.outstandingDues || "0",
        ]
          .filter((x) => x !== undefined && x !== null)
          .join(", "),
      })) || [];

    const riskScoreProperties =
      formData.riskScores
        ?.filter((score) => score.value !== null && score.date !== null)
        .map((score) => ({
          propertyName: "CreditBureauScore",
          propertyValue: `${score.value},${score.date},${score.bureauName.toUpperCase().replace(/ /g, "_")}`,
        })) || [];

    return {
      borrowerIdentificationType:
        customerData.generalAttributeClientNaturalPersons[0].typeIdentification,
      borrowerIdentificationNumber: customerData.publicCode,
      borrowerType: "MainBorrower",
      borrowerName: customerData.fullName,

      borrowerProperties: [
        ...numericIncomeProperties,
        ...financialObligationProperties,
        ...riskScoreProperties,
      ],
    };
  }, [
    customerData,
    formData.sourcesOfIncome,
    formData.obligationsFinancial,
    formData.riskScores,
  ]);
  const simulateData: IProspect = useMemo(
    () => ({
      clientIdentificationNumber: customerData.publicCode,
      clientManagerName: customerData.fullName,
      borrowers:
        Object.keys(formData.borrowerData.borrowers).length === 0
          ? [onlyBorrowerData]
          : (formData.borrowerData.borrowers as IBorrower[]),
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
      linesOfCredit: formData.selectedProducts,
      firstPaymentCycleDate: formData.loanAmountState.payAmount || "",
      extraordinaryInstallments: Array.isArray(
        formData.extraordinaryInstallments,
      )
        ? formData.extraordinaryInstallments.map((item) => ({
            installmentAmount: item.value as number,
            installmentDate: item.datePayment as string | Date,
            paymentChannelAbbreviatedName: item.cycleName as string,
          }))
        : [],
      installmentLimit: formData.loanConditionState.quotaCapValue || 0,
      moneyDestinationAbbreviatedName: formData.selectedDestination,
      preferredPaymentChannelAbbreviatedName:
        formData.loanAmountState.paymentPlan || "",
      selectedRegularPaymentSchedule:
        formData.loanAmountState.paymentCycle || "",
      paymentChannelCycleName: formData.loanAmountState.paymentCycle || "",
      requestedAmount: formData.loanAmountState.inputValue || 0,
      ...(formData.loanConditionState.maximumTermValue != null &&
        formData.loanConditionState.maximumTermValue != "" && {
          termLimit: formData.loanConditionState.maximumTermValue,
        }),
      prospectId: "",
      prospectCode: "",
      state: "",
      selectedRateType: "",
      gracePeriod: 0,
      bondValue: 0,
      creditProducts: [],
      outlays: [],
      creditScore: "",
      clientManagerIdentificationNumber: "",
      clientManagerObservation: "",
      clientComments: "",
    }),
    [formData, onlyBorrowerData],
  );

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [creditLineTerms, setCreditLineTerms] = useState<{
    [lineName: string]: {
      LoanAmountLimit: number;
      LoanTermLimit: number;
      RiskFreeInterestRate: number;
    };
  }>({});

  const fetchCreditLineTerms = useCallback(async () => {
    if (eventData.businessManager.abbreviatedName.length === 0) {
      setCodeError(1003);
      setAddToFix([messagesError.noBusinessUnitAvaliable.i18n[lang]]);
    }
    if (customerData.fullName.length === 0) {
      setCodeError(1016);
      setAddToFix([messagesError.noClientSelected.i18n[lang]]);
    } else {
      setCodeError(null);
    }

    const clientInfo = customerData?.generalAttributeClientNaturalPersons?.[0];

    if (!clientInfo?.associateType || !formData.selectedDestination) return;

    try {
      const lineOfCreditValues = await getLinesOfCreditByMoneyDestination(
        businessUnitPublicCode,
        businessManagerCode,
        formData.selectedDestination,
        customerData.publicCode,
        eventData.token,
      );

      const linesArray = Array.isArray(lineOfCreditValues)
        ? lineOfCreditValues
        : [lineOfCreditValues];

      const result: Record<
        string,
        {
          LoanAmountLimit: number;
          LoanTermLimit: number;
          RiskFreeInterestRate: number;
        }
      > = {};

      linesArray.forEach((line: ILinesOfCreditByMoneyDestination) => {
        if (line && line.abbreviateName) {
          result[line.abbreviateName] = {
            LoanAmountLimit: line.maxAmount,
            LoanTermLimit: line.maxTerm,
            RiskFreeInterestRate: line.maxEffectiveInterestRate,
          };
        }
      });

      setCreditLineTerms(result);
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(messagesError.tryLater.i18n[lang]);
      setAllowToContinue(false);
    }
  }, [customerData, businessUnitPublicCode, formData.selectedDestination]);

  const fetchRulesByProducts = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const results = await Promise.all(
        formData.selectedProducts.map(async (product) => {
          const [financial, borrowers, extra] = await Promise.all([
            getFinancialObligationsUpdate(
              businessUnitPublicCode,
              businessManagerCode,
              product,
              customerData.publicCode,
              formData.selectedDestination,
              eventData.token,
            ),
            getAdditionalBorrowersAllowed(
              businessUnitPublicCode,
              businessManagerCode,
              product,
              customerData.publicCode,
              formData.selectedDestination,
              eventData.token,
            ),
            getExtraInstallmentsAllowed(
              businessUnitPublicCode,
              businessManagerCode,
              product,
              customerData.publicCode,
              formData.selectedDestination,
              eventData.token,
            ),
          ]);

          return {
            product,
            financialObligation:
              financial?.financialObligationsUpdateRequired ?? "N",
            aditionalBorrowers: borrowers?.additionalBorrowersAllowed ?? "N",
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
      setShowErrorModal(true);
      setMessageError(messagesError.tryLater.i18n[lang]);
      setAllowToContinue(false);
    } finally {
      setLoadingQuestions(false);
    }
  }, [formData.selectedProducts]);

  const fetchDataClientPortfolio = async () => {
    if (!customerPublicCode) {
      return;
    }
    try {
      const data = await getFinancialObligations(
        customerData.publicCode,
        businessUnitPublicCode,
        businessManagerCode,
        eventData.token,
      );

      setClientPortfolio({
        customerIdentificationNumber: customerData.publicCode,
        customerName: customerData.fullName,
        customerIdentificationType:
          customerData.generalAttributeClientNaturalPersons?.[0]
            .typeIdentification || "",
        obligations: data ? data : [],
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
  };

  const fetchCapacityAnalysis = async () => {
    if (!customerPublicCode) {
      return;
    }
    const data: IPaymentCapacity = {
      clientIdentificationNumber: customerData.publicCode,
      dividends: formData.sourcesOfIncome?.Dividends ?? 0,
      financialIncome: formData.sourcesOfIncome?.FinancialIncome ?? 0,
      leases: formData.sourcesOfIncome?.Leases ?? 0,
      otherNonSalaryEmoluments:
        formData.sourcesOfIncome?.OtherNonSalaryEmoluments ?? 0,
      pensionAllowances: formData.sourcesOfIncome?.PensionAllowances ?? 0,
      periodicSalary: formData.sourcesOfIncome?.PeriodicSalary ?? 0,
      personalBusinessUtilities:
        formData.sourcesOfIncome?.PersonalBusinessUtilities ?? 0,
      professionalFees: formData.sourcesOfIncome?.ProfessionalFees ?? 0,
      livingExpenseToIncomeRatio: 0,
    };

    try {
      const paymentCapacity = await getBorrowerPaymentCapacityById(
        businessUnitPublicCode,
        businessManagerCode,
        data,
        eventData.token,
      );
      setPaymentCapacity(paymentCapacity ?? null);
    } catch (error: unknown) {
      setShowErrorModal(true);
      setMessageError(messagesError.tryLater.i18n[lang]);
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
        businessManagerCode,
        eventData.token,
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

  const fetchDataPaymentDatesCycle = async () => {
    if (!customerPublicCode) {
      return;
    }
    const data: IPaymentDatesChannel = {
      clientIdentificationNumber: customerData.publicCode,
      clientIdentificationType:
        customerData.generalAttributeClientNaturalPersons[0].typeIdentification,
      moneyDestination: formData.selectedDestination,
      Dividends: 0,
      FinancialIncome: 0,
      Leases: 0,
      OtherNonSalaryEmoluments: 0,
      PensionAllowances: 0,
      PeriodicSalary: 0,
      PersonalBusinessUtilities: 0,
      ProfessionalFees: 0,
      linesOfCredit: formData.selectedProducts,
    };
    try {
      const dataPaymentDates = await GetSearchAllPaymentChannels(
        businessUnitPublicCode,
        businessManagerCode,
        data,
        eventData.token,
      );
      setPaymentChannel(dataPaymentDates ?? null);
    } catch (error: unknown) {
      setShowErrorModal(true);
      setMessageError(messagesError.tryLater.i18n[lang]);
      setAllowToContinue(false);
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
    (formData.sourcesOfIncome?.Dividends ?? 0) +
    (formData.sourcesOfIncome?.FinancialIncome ?? 0) +
    (formData.sourcesOfIncome?.Leases ?? 0) +
    (formData.sourcesOfIncome?.OtherNonSalaryEmoluments ?? 0) +
    (formData.sourcesOfIncome?.PensionAllowances ?? 0) +
    (formData.sourcesOfIncome?.PeriodicSalary ?? 0) +
    (formData.sourcesOfIncome?.PersonalBusinessUtilities ?? 0) +
    (formData.sourcesOfIncome?.ProfessionalFees ?? 0);

  const prevStepRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentStep === stepsAddProspect.productSelection.id) {
      setFormData((prevState) => ({
        ...prevState,
        togglesState: [false, false, false, false],
      }));
    }
    if (currentStep === stepsAddProspect.destination.id) {
      if (
        prevStepRef.current &&
        prevStepRef.current < stepsAddProspect.destination.id
      ) {
        setFormData((prevState) => ({
          ...prevState,
          selectedProducts: [],
        }));
      }
    }
  }, [currentStep]);

  useEffect(() => {
    const fetchBureauConfiguration = async () => {
      if (!businessUnitPublicCode) return;

      try {
        const configData = await getUpdateMethodByCreditRiskBureauName(
          businessUnitPublicCode,
          businessManagerCode,
          customerData.token,
        );

        const methods = configData?.creditRiskBureaus || [];
        setBureauMethods(methods);
        await handleBureauConsultation(methods);
      } catch (error) {
        const err = error as {
          message?: string;
          status: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + err?.message + (err?.data?.description || "");

        setMessageError(description);
        setShowErrorModal(true);
      }
    };

    fetchBureauConfiguration();
  }, [businessUnitPublicCode, customerData.token]);

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
      showRiskScoreStep ? stepsAddProspect.riskScore.id : undefined,
      servicesProductSelection?.financialObligation.includes("Y")
        ? stepsAddProspect.obligationsFinancial.id
        : togglesState[1]
          ? stepsAddProspect.obligationsFinancial.id
          : undefined,
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
      setSentModal(true);
      return;
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
      setSentModal(true);
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
      showRiskScoreStep ? stepsAddProspect.riskScore.id : undefined,
      servicesProductSelection?.financialObligation.includes("Y")
        ? stepsAddProspect.obligationsFinancial.id
        : togglesState[1]
          ? stepsAddProspect.obligationsFinancial.id
          : undefined,
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
      ? titleButtonTextAssited.submitText.i18n[lang]
      : titleButtonTextAssited.goNextText.i18n[lang];

  const handleBureauConsultation = useCallback(
    async (methods: ICreditRiskBureauUpdateMethod[]) => {
      if (!customerData.publicCode || methods.length === 0) {
        setShowRiskScoreStep(false);
        return;
      }

      try {
        const consultationData =
          await creditConsultationInBuroByIdentificationNumber(
            businessUnitPublicCode,
            businessManagerCode,
            customerData.publicCode,
            eventData.token,
          );

        setOriginalBureauData(consultationData || []);

        const hasActiveScore = (consultationData || []).some(
          (score) => score.isActive === "Y",
        );

        setShowRiskScoreStep(!hasActiveScore);

        const scoresForState = methods.map((method) => {
          const existingScore = (consultationData || []).find(
            (score) => score.bureauName === method.bureauName,
          );
          const normalizedBureauName = method.bureauName
            .toLowerCase()
            .replace("_", " ");
          return {
            value: existingScore ? existingScore.creditRiskScore : null,
            date: existingScore ? existingScore.queryDate : null,
            bureauName: normalizedBureauName,
            bureauNameEnum: method.bureauName,
          };
        });

        handleFormDataChange("riskScores", scoresForState);
      } catch (error) {
        const err = error as {
          message?: string;
          status: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + err?.message + (err?.data?.description || "");

        setMessageError(description);
        setShowErrorModal(true);
      }
    },
    [customerData.publicCode, businessUnitPublicCode, businessManagerCode],
  );

  const handleUpdateRiskScore = async (
    index: number,
    newRisk: { value: number; date: string },
  ) => {
    const scoreToUpdate = formData.riskScores[index];
    const originalRecord = originalBureauData.find(
      (score) =>
        score.bureauName.toLowerCase().replace(/_/g, " ") ===
        scoreToUpdate.bureauName.toLowerCase().replace(/_/g, " "),
    );

    setIsLoadingUpdate(true);
    try {
      let payload: IUpdateCreditRiskBureauQuery;

      if (originalRecord) {
        payload = {
          ...originalRecord,
          bureauName: scoreToUpdate.bureauNameEnum,
          creditRiskScore: newRisk.value,
          queryDate: newRisk.date,
          registrantIdentificationNumber:
            eventData.user.identificationDocumentNumber || "",
        };
      } else {
        payload = {
          clientName: customerData.fullName,
          bureauName: scoreToUpdate.bureauNameEnum,
          creditRiskScore: newRisk.value,
          queryDate: newRisk.date,
          clientIdentificationNumber: customerData.publicCode,
          clientIdentificationType:
            customerData.generalAttributeClientNaturalPersons?.[0]
              ?.typeIdentification || "",
          registrantIdentificationNumber:
            eventData.user.identificationDocumentNumber || "",
        };
      }

      await updateCreditRiskBureauQuery(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
      );

      const updatedScores = formData.riskScores.map((score, indexScore) => {
        if (indexScore === index) {
          return {
            ...score,
            value: newRisk.value,
            date: newRisk.date,
          };
        }
        return score;
      });

      handleFormDataChange("riskScores", updatedScores);

      addFlag({
        title: creditScoreChanges.title.i18n[lang],
        description: creditScoreChanges.description.i18n[lang],
        appearance: "success",
        duration: 5000,
      });
    } catch (error) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");

      setMessageError(description);
      setShowErrorModal(true);
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const handleSubmitClick = async () => {
    setIsLoadingSubmit(true);
    if (simulateData.termLimit === 0) {
      delete simulateData.termLimit;
    }

    if (simulateData.installmentLimit === 0) {
      delete simulateData.installmentLimit;
    }

    try {
      const response = await postSimulateCredit(
        businessUnitPublicCode,
        businessManagerCode,
        eventData.user.identificationDocumentNumber || "",
        simulateData,
        eventData.token,
      );
      const prospectCode = response?.prospectCode;

      if (prospectCode === undefined) {
        setShowErrorModal?.(true);
        setMessageError?.(messagesError.undefinedCodeProspect.i18n[lang]);
      } else {
        setProspectCode(prospectCode);
        setSentModal(false);
        setCreatedProspectModal(true);
      }
    } catch (error) {
      setShowErrorModal?.(true);
      setMessageError?.(`${messagesError.handleSubmit}. ${error}`);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const fetchCreditLimit = async () => {
    try {
      const result = await getCreditLimit(
        businessUnitPublicCode,
        businessManagerCode,
        customerPublicCode,
        eventData.token,
      );
      setCreditLimitData(result);
    } catch (error: unknown) {
      setShowErrorModal(true);
      setMessageError(messagesError.tryLater.i18n[lang]);
    } finally {
      setIsLoadingCreditLimit(false);
    }
  };

  useEffect(() => {
    if (currentStep === stepsAddProspect.generalInformation.id) {
      fetchCreditLimit();
    }

    if (currentStep === stepsAddProspect.productSelection.id) {
      fetchDataClientPortfolio();
      fetchDataObligationPayment();
      fetchCapacityAnalysis();
      fetchDataPaymentDatesCycle();
    }
  }, [currentStep, formData.selectedProducts]);

  useEffect(() => {
    if (isCapacityAnalysisModal) {
      fetchCapacityAnalysis();
    }
  }, [isCapacityAnalysisModal]);

  useEffect(() => {
    if (!customerData?.customerId || !simulateData) return;
    const payload = {
      clientIdentificationNumber: customerData.publicCode,
      prospect: {
        ...simulateData,
        creditProducts: formData.selectedProducts.map((product) => {
          return {
            lineOfCreditAbbreviatedName: product,
          };
        }),
      },
    };
    const handleSubmit = async () => {
      setIsLoading(true);
      try {
        const data = await patchValidateRequirements(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
          eventData.token,
        );
        if (data) {
          setValidateRequirements(data);
        }
      } catch (error) {
        setErrorsManager((prev) => {
          return { ...prev, validateRequirements: true };
        });
        setShowErrorModal(true);
        setMessageError(messagesError.tryLater.i18n[lang]);
      } finally {
        setIsLoading(false);
      }
    };

    handleSubmit();
  }, [currentStep, businessUnitPublicCode]);

  useEffect(() => {
    if (
      clientPortfolio &&
      (!formData.obligationsFinancial ||
        Object.keys(formData.obligationsFinancial).length === 0)
    ) {
      setFormData((prevState) => ({
        ...prevState,
        obligationsFinancial: clientPortfolio,
      }));
    }
  }, [clientPortfolio, formData.obligationsFinancial]);

  const stableSelectedProducts = useMemo(
    () => formData.selectedProducts,
    [formData.selectedProducts.join(",")],
  );

  useEffect(() => {
    if (stableSelectedProducts.length > 0) {
      fetchRulesByProducts();
    }
  }, [stableSelectedProducts]);

  useEffect(() => {
    const isExtraBorrowersStep =
      currentStepsNumber?.id === stepsAddProspect.extraBorrowers.id;

    if (isExtraBorrowersStep) {
      const newMainBorrower = createMainBorrowerFromFormData(
        formData,
        customerData,
      );

      const otherBorrowers = formData.borrowerData.borrowers.filter(
        (borrower) => borrower.borrowerType !== "MainBorrower",
      );

      const existMainBorrower = formData.borrowerData.borrowers.filter(
        (borrower) => borrower.borrowerType === "MainBorrower",
      );

      let keepBeforeChanges = newMainBorrower;

      if (existMainBorrower.length) {
        keepBeforeChanges = {
          ...existMainBorrower[0],
          borrowerProperties: [...newMainBorrower.borrowerProperties],
        };
      }

      const updatedBorrowers = [keepBeforeChanges, ...otherBorrowers];
      handleFormDataChange("borrowerData", { borrowers: updatedBorrowers });
    }
  }, [currentStepsNumber, customerData]);

  useEffect(() => {
    const isFinancialStep =
      currentStepsNumber?.id === stepsAddProspect.obligationsFinancial.id;
    if (isFinancialStep && formData.borrowerData.borrowers.length > 0) {
      const newObligations = updateFinancialObligationsFormData(
        formData.borrowerData.borrowers,
      );

      handleFormDataChange("obligationsFinancial", {
        ...formData.obligationsFinancial,
        obligations: newObligations,
      });
    }
  }, [currentStepsNumber]);

  useEffect(() => {
    const mainBorrower = formData.borrowerData.borrowers.find(
      (borrower) => borrower.borrowerType === "MainBorrower",
    );

    if (!mainBorrower) {
      return;
    }

    const incomeProperties: { [key: string]: number } = {};
    mainBorrower.borrowerProperties.forEach((prop) => {
      const incomeKeys = [
        "Dividends",
        "FinancialIncome",
        "Leases",
        "OtherNonSalaryEmoluments",
        "PensionAllowances",
        "PeriodicSalary",
        "PersonalBusinessUtilities",
        "ProfessionalFees",
      ];
      if (incomeKeys.includes(prop.propertyName)) {
        incomeProperties[prop.propertyName] = Number(prop.propertyValue) || 0;
      }
    });

    const newSourcesOfIncome = {
      ...formData.sourcesOfIncome,
      ...incomeProperties,
    };

    if (
      JSON.stringify(formData.sourcesOfIncome) !==
      JSON.stringify(newSourcesOfIncome)
    ) {
      handleFormDataChange("sourcesOfIncome", newSourcesOfIncome);
    }
  }, [formData.borrowerData.borrowers]);

  const handleModalTryAgain = () => {
    setShowErrorModal(false);
    navigate("/credit/prospects");
  };

  const handleNavigate = () => {
    if (codeError === 1003) {
      navigate(`/login/${user.username}/business-units/select-business-unit`);
    } else if (codeError === 1016) {
      navigate("/clients/select-client/");
    } else {
      navigate("/credit");
    }
  };

  const dataMaximumCreditLimitService = useMemo(
    () => ({
      identificationDocumentType:
        customerData.generalAttributeClientNaturalPersons[0].typeIdentification,
      identificationDocumentNumber: customerData.publicCode,
      moneyDestination: formData.selectedDestination,
      lineOfCreditAbbreviatedName: formData.selectedProducts[0] || "",
      primaryIncomeType:
        typeof formData.sourcesOfIncome?.PeriodicSalary === "number"
          ? formData.sourcesOfIncome.PeriodicSalary.toString()
          : "0",
    }),
    [
      customerData.publicCode,
      customerData.generalAttributeClientNaturalPersons,
      formData.selectedDestination,
      formData.sourcesOfIncome?.PeriodicSalary,
    ],
  );

  useEffect(() => {
    if (Object.keys(creditLineTerms).length > 0) {
      if (formData.generalToggleChecked) {
        const all = Object.keys(creditLineTerms);
        setFormData((prev) => ({
          ...prev,
          selectedProducts: all,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          selectedProducts: [],
        }));
      }
    }
  }, [formData.generalToggleChecked, formData.togglesState, creditLineTerms]);

  const maxLoanTerm = Math.max(
    ...Object.values(creditLineTerms || {}).map((term) => term.LoanTermLimit),
  );

  return (
    <>
      <SimulateCreditUI
        isLoadingCreditLimit={isLoadingCreditLimit}
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
        lang={lang}
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
        dataMaximumCreditLimitService={
          dataMaximumCreditLimitService as IdataMaximumCreditLimitService
        }
        servicesProductSelection={
          servicesProductSelection as IServicesProductSelection
        }
        paymentCapacity={paymentCapacity}
        showErrorModal={showErrorModal}
        messageError={messageError}
        businessUnitPublicCode={businessUnitPublicCode}
        businessManagerCode={businessManagerCode}
        handleModalTryAgain={handleModalTryAgain}
        allowToContinue={allowToContinue}
        sentModal={sentModal}
        setSentModal={setSentModal}
        createdProspectModal={createdProspectModal}
        setCreatedProspectModal={setCreatedProspectModal}
        prospectCode={prospectCode}
        errorsManager={errorsManager}
        paymentChannel={paymentChannel}
        userAccount={userAccount}
        loadingQuestions={loadingQuestions}
        showSelectsLoanAmount={!formData.togglesState[0]}
        isLoadingSubmit={isLoadingSubmit}
        enums={enums as IAllEnumsResponse}
        handleNavigate={handleNavigate}
        handleUpdateRiskScore={handleUpdateRiskScore}
        isLoadingUpdate={isLoadingUpdate}
        setMessageError={setMessageError}
        bureauMethods={bureauMethods}
        handleBureauConsultation={handleBureauConsultation}
        maxLoanTerm={maxLoanTerm}
      />
    </>
  );
}
