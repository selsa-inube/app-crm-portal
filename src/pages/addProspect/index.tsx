import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@inubekit/inubekit";

import { Consulting } from "@components/modals/Consulting";
import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";
import { getMonthsElapsed } from "@utils/formatData/currency";
import { postBusinessUnitRules } from "@services/businessUnitRules";
import { postSimulateCredit } from "@services/iProspect/simulateCredit";
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
      borrowers: {},
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

  const prospectData = {
    prospectId: "",
    prospectCode: "",
    state: "Created",
    requestedAmount: 0,
    installmentLimit: 0,
    termLimit: 0,
    timeOfCreation: "2025-03-31T15:04:05Z",
    selectedRegularPaymentSchedule: "monthly",
    selectedRateType: "fixed",
    preferredPaymentChannelAbbreviatedName: "Nómina mensual presente",
    gracePeriod: 0,
    gracePeriodType: "principal_grace",
    moneyDestinationAbbreviatedName: formData.selectedDestination,
    bondValue: 0,
    borrowers: [
      {
        borrowerName: "Andres Giraldo Hurtado",
        borrowerType: "MainBorrower",
        borrowerIdentificationType: "CitizenshipID",
        borrowerIdentificationNumber: "16378491",
        borrowerProperties: [
          {
            propertyName: "PeriodicSalary",
            propertyValue: "4500000",
          },
          {
            propertyName: "PersonalBusinessUtilities",
            propertyValue: "1000000",
          },
          {
            propertyName: "FinancialObligation",
            propertyValue:
              "consumo, 10000000, 600000, Bancolombia, Caja, 12546, 5, 60",
          },
          {
            propertyName: "FinancialObligation",
            propertyValue:
              "tarjeta, 2000000, 300000, Falabella, Caja, 3524, 10, 40",
          },
          {
            propertyName: "FinancialObligation",
            propertyValue:
              "vivienda, 105000000, 1450000, Davivienda, Caja, 4721, 12, 60",
          },
          {
            propertyName: "name",
            propertyValue: "Andrés",
          },
          {
            propertyName: "surname",
            propertyValue: "Giraldo Hurtado",
          },
          {
            propertyName: "email",
            propertyValue: "andres.giraldo@gmail.com",
          },
          {
            propertyName: "biological_sex",
            propertyValue: "male",
          },
          {
            propertyName: "phone_number",
            propertyValue: "3102330109",
          },
          {
            propertyName: "birth_date",
            propertyValue: "1987-01-02T15:04:05Z",
          },
          {
            propertyName: "relationship",
            propertyValue: "brother",
          },
        ],
      },
    ],
    consolidatedCredits: [
      {
        creditProductCode: "12554",
        consolidatedAmount: 0,
        consolidatedAmountType: "installment",
        estimatedDateOfConsolidation: "2025-04-15T15:04:05Z",
        lineOfCreditDescription: "Crédito libre inversión",
        borrowerIdentificationType: "CitizenshipID",
        borrowerIdentificationNumber: "1019542336",
      },
    ],
    creditProducts: [
      {
        creditProductCode: "SC-122254646-2",
        loanAmount: 0,
        lineOfCreditAbbreviatedName: "Crédito educativo",
        interestRate: 0,
        loanTerm: 0,
        schedule: "monthly",
        ordinaryInstallmentsForPrincipal: [
          {
            numberOfInstallments: 0,
            schedule: "monthly",
            installmentAmount: 0,
            paymentChannelAbbreviatedName: "Nómina mensual presente",
          },
        ],
        extraordinaryInstallments: [
          {
            installmentDate: "2025-06-30T15:04:05Z",
            installmentAmount: 0,
            paymentChannelAbbreviatedName: "Nómina regular selsa",
          },
        ],
      },
    ],
    outlays: [
      {
        date: "2025-04-15T15:04:05Z",
        amount: formData.loanAmountState.inputValue || 0,
      },
    ],
  };

  const onlyBorrowerData = {
    borrowerIdentificationType:
      customerData.generalAttributeClientNaturalPersons[0].typeIdentification,
    borrowerIdentificationNumber: customerData.publicCode,
  };

  console.log("formData", formData);

  const simulateData = {
    borrowers:
      Object.keys(formData.borrowerData.borrowers).length === 0
        ? onlyBorrowerData
        : formData.borrowerData.borrowers,
    consolidatedCredits: [
      // paso 10
      {
        borrowerIdentificationNumber: "string", //customer
        borrowerIdentificationType: "string", // customer
        consolidatedAmount: 0, // valor
        consolidatedAmountType: "string", //label
        creditProductCode: "string", //code
        lineOfCreditDescription: "string", //title
      },
    ],
    linesOfCredit: formData.selectedProducts.map((product) => ({
      lineOfCreditAbbreviatedName: product,
    })),
    extraordinaryInstallments: [
      // paso 4 - abonos especiales
      {
        installmentAmount: 0,
        installmentDate: "string",
        paymentChannelAbbreviatedName: "string",
      },
    ],
    installmentLimit: formData.loanConditionState.quotaCapValue,
    moneyDestinationAbbreviatedName: formData.selectedDestination,
    preferredPaymentChannelAbbreviatedName:
      formData.loanAmountState.paymentPlan,
    selectedRegularPaymentSchedule: formData.loanAmountState.payAmount,
    requestedAmount: formData.loanAmountState.inputValue,
    termLimit: formData.loanConditionState.maximumTermValue,
  };

  console.log("creditData", simulateData);
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

  const handleSubmit = async () => {
    try {
      await postSimulateCredit(businessUnitPublicCode, simulateData);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
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
        prospectData={prospectData}
        setSelectedProducts={setSelectedProducts}
        setIsCapacityAnalysisModal={setIsCapacityAnalysisModal}
        isCapacityAnalysisModal={isCapacityAnalysisModal}
        handleFormDataChange={handleFormDataChange}
        handleConsolidatedCreditChange={handleConsolidatedCreditChange}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      {showConsultingModal && <Consulting />}
    </>
  );
}
