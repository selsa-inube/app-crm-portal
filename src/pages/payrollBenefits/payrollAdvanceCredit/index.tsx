import React from "react";
import { useContext, useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@inubekit/inubekit";

import { ICustomerData } from "@context/CustomerContext/types";
import { CustomerContext } from "@context/CustomerContext";
import { AppContext } from "@context/AppContext";
import { IBorrower, IProspect } from "@services/prospect/types";
import { IValidateRequirement } from "@services/requirement/types";
import { patchValidateRequirements } from "@services/requirement/validateRequirements";
import { IFormData, IManageErrors } from "@pages/simulateCredit/types";
import { useBorrowerData } from "@hooks/useBorrowerData";
import { useEnum } from "@hooks/useEnum/useEnum";

import { PayRollUI } from "./interface";
import { IBonusFormData, titleButtonTextAssited } from "../types";
import { stepsPayrollSpecialBenefitAdvanceCredit } from "./config/addBonus.config";
import { availableQuotaValue } from "../steps/requestedValue";

export function PayrollAdvanceCredit() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1482px)");

  const { lang } = useEnum();

  const [currentStep, setCurrentStep] = useState<number>(
    stepsPayrollSpecialBenefitAdvanceCredit.generalInformation.id,
  );
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const businessManagerCode = eventData.businessManager.abbreviatedName;
  const steps = Object.values(stepsPayrollSpecialBenefitAdvanceCredit);
  const { customerData } = useContext(CustomerContext);

  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
  };

  const lastStepId = steps[steps.length - 1].id;
  const [isLoading, setIsLoading] = useState(true);
  const [validateRequirements, setValidateRequirements] = useState<
    IValidateRequirement[]
  >([]);
  const [errorsManager, setErrorsManager] = useState<IManageErrors>({});
  const [isModalOpenRequirements, setIsModalOpenRequirements] = useState(false);

  const [showExceedQuotaModal, setShowExceedQuotaModal] = useState(false);

  const handleNextStep = () => {
    if (
      currentStep === stepsPayrollSpecialBenefitAdvanceCredit.destination.id
    ) {
      const currentAmount = Number(formData.requestedValue);

      if (currentAmount > availableQuotaValue) {
        setShowExceedQuotaModal(true);
        return;
      }
    }
    if (currentStep < lastStepId && isCurrentFormValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const assistedButtonText =
    currentStep === lastStepId
      ? titleButtonTextAssited.submitText
      : titleButtonTextAssited.goNextText;

  const handlePreviousStep = () => {
    const firstStepId = steps[0].id;
    if (currentStep > firstStepId) {
      setCurrentStep(currentStep - 1);
    }
    setIsCurrentFormValid(true);
  };

  const currentStepsNumber = steps.find(
    (step: { number: number }) => step.number === currentStep,
  );

  const [formData, setFormData] = useState<IFormData>({
    requestedValue: "",
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
    obligationsFinancial: null,
    loanAmountState: {
      inputValue: "",
      toggleChecked: false,
      paymentPlan: "",
      periodicity: "",
      payAmount: "",
      paymentCycle: "",
    },
    consolidatedCreditArray: [],
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
    riskScore: {
      value: 0,
      date: "",
    },
    disbursementGeneral: {
      amount: 0,
      Internal_account: {
        amount: 0,
        accountNumber: "",
        description: "",
        name: "",
        lastName: "",
        sex: "",
        identification: "",
        birthdate: "",
        phone: "",
        mail: "",
        city: "",
        check: false,
        toggle: true,
        documentType: "",
        accountLabel: "",
      },
      External_account: {
        amount: 0,
        check: false,
        toggle: true,
        description: "",
        name: "",
        lastName: "",
        sex: "",
        identification: "",
        birthdate: "",
        phone: "",
        mail: "",
        city: "",
        bank: "",
        accountType: "",
        accountNumber: "0",
        documentType: "",
      },
      Certified_check: {
        amount: 0,
        check: false,
        toggle: true,
        description: "",
        name: "",
        lastName: "",
        sex: "",
        documentType: "",
        identification: "",
        birthdate: "",
        phone: "",
        mail: "",
        city: "",
      },
      Business_check: {
        amount: 0,
        check: false,
        toggle: true,
        description: "",
        name: "",
        lastName: "",
        sex: "",
        documentType: "",
        identification: "",
        birthdate: "",
        phone: "",
        mail: "",
        city: "",
      },
      Cash: {
        amount: 0,
        check: false,
        toggle: true,
        description: "",
        name: "",
        lastName: "",
        sex: "",
        documentType: "",
        identification: "",
        birthdate: "",
        phone: "",
        mail: "",
        city: "",
      },
    },
    requirementsValidation: {
      requirements: [],
      isValid: false,
      validatedAt: null,
      unfulfilledCount: 0,
    },
  });

  const onlyBorrowerData = useBorrowerData({
    customerData,
    sourcesOfIncome: formData.sourcesOfIncome,
    obligationsFinancial: formData.obligationsFinancial,
    riskScore: formData.riskScore,
  });

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
      firstPaymentCycleDate: new Date().toISOString(),
      extraordinaryInstallments: Array.isArray(
        formData.extraordinaryInstallments,
      )
        ? formData.extraordinaryInstallments.map((item) => ({
            installmentAmount: item.value as number,
            installmentDate: item.datePayment as string | Date,
            paymentChannelAbbreviatedName: item.paymentMethod as string,
          }))
        : [],
      installmentLimit: formData.loanConditionState.quotaCapValue || 0,
      moneyDestinationAbbreviatedName: formData.selectedDestination,
      preferredPaymentChannelAbbreviatedName:
        formData.loanAmountState.paymentPlan || "",
      selectedRegularPaymentSchedule:
        formData.loanAmountState.periodicity || "",
      requestedAmount: formData.loanAmountState.inputValue || 0,
      termLimit: formData.loanConditionState.maximumTermValue || 120,
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

  useEffect(() => {
    if (!customerData?.customerId || !simulateData) return;
    const payload = {
      clientIdentificationNumber: customerData.publicCode,
      prospect: { ...simulateData },
    };
    const handleSubmit = async () => {
      setIsLoading(true);
      try {
        const data = await patchValidateRequirements(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
        );
        if (data) {
          setValidateRequirements(data);
        }
      } catch (error) {
        setErrorsManager((prev) => {
          return { ...prev, validateRequirements: true };
        });
      } finally {
        setIsLoading(false);
      }
    };

    handleSubmit();
  }, [currentStep, businessUnitPublicCode]);

  const handleRequirementsValidated = useCallback(
    (requirements: IValidateRequirement[]) => {
      const unfulfilledRequirements = requirements.filter(
        (req) => req.requirementStatus !== "Aprobado",
      );

      const validationData = {
        requirements: requirements,
        isValid: unfulfilledRequirements.length === 0,
        validatedAt: new Date(),
        unfulfilledCount: unfulfilledRequirements.length,
      };

      setFormData((prev) => ({
        ...prev,
        requirementsValidation: validationData,
      }));
    },
    [],
  );

  const handleAmountChange = useCallback((amount: string) => {
    setFormData((prev) => ({
      ...prev,
      requestedValue: amount,
    }));
  }, []);

  const handleValidationChange = useCallback((isValid: boolean) => {
    setIsCurrentFormValid(isValid);
  }, []);

  const [prospectData, setProspectData] = useState<IProspect>({
    prospectId: "",
    prospectCode: "",
    state: "",
    requestedAmount: 0,
    installmentLimit: 0,
    termLimit: 0,
    timeOfCreation: new Date(),
    selectedRegularPaymentSchedule: "",
    selectedRateType: "",
    preferredPaymentChannelAbbreviatedName: "",
    gracePeriod: 0,
    gracePeriodType: "",
    moneyDestinationAbbreviatedName: "",
    bondValue: 0,
    creditScore: "",
    modifyJustification: "",
    clientManagerIdentificationNumber: "",
    clientManagerName: "",
    clientManagerObservation: "",
    clientComments: "",
    borrowers: [],
    consolidatedCredits: [],
    creditProducts: [],
    outlays: [],
  });

  const handleFormChange = (updatedValues: Partial<IBonusFormData>) => {
    setFormData((prev) => {
      if (
        JSON.stringify(prev) !== JSON.stringify({ ...prev, ...updatedValues })
      ) {
        return {
          ...prev,
          ...updatedValues,
        };
      }
      return prev;
    });
  };

  const handleSubmitClick = () => {
    if (currentStep === lastStepId && isCurrentFormValid) {
      setShowSubmitModal(true);
    }
  };
  const [showInfoModal, setShowInfoModal] = React.useState(false);

  const handleBackClick = () => {
    setShowInfoModal(true);
  };

  const handleCancelNavigation = () => {
    setShowInfoModal(false);
  };

  const handleConfirmNavigation = () => {
    setShowInfoModal(false);
    navigate("/credit");
  };
  const handleSubmitBonus = async () => {
    setIsLoadingSubmit(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowSubmitModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      setShowSubmitModal(false);
      setShowErrorModal(true);
      setMessageError(
        "Error al enviar la solicitud de bono. Por favor, intente nuevamente.",
      );
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate("/credit", { state: { showSuccessFlag: true } });
  };

  return (
    <PayRollUI
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
      navigate={navigate}
      currentStep={currentStep}
      isCurrentFormValid={isCurrentFormValid}
      isMobile={isMobile}
      currentStepsNumber={currentStepsNumber}
      assistedButtonText={assistedButtonText}
      codeError={null}
      prospectData={prospectData}
      customerData={customerData as ICustomerData}
      dataHeader={dataHeader}
      steps={steps}
      businessUnitPublicCode={businessUnitPublicCode}
      showExceedQuotaModal={showExceedQuotaModal}
      setShowExceedQuotaModal={setShowExceedQuotaModal}
      businessManagerCode={businessManagerCode}
      formData={formData}
      onAmountChange={handleAmountChange}
      onValidationChange={handleValidationChange}
      setIsCurrentFormValid={setIsCurrentFormValid}
      handleFormChange={handleFormChange}
      setProspectData={setProspectData}
      showErrorModal={showErrorModal}
      messageError={messageError}
      setShowErrorModal={setShowErrorModal}
      setMessageError={setMessageError}
      setCurrentStep={setCurrentStep}
      onRequirementsValidated={handleRequirementsValidated}
      showSubmitModal={showSubmitModal}
      setShowSubmitModal={setShowSubmitModal}
      showSuccessModal={showSuccessModal}
      setShowSuccessModal={setShowSuccessModal}
      isLoadingSubmit={isLoadingSubmit}
      handleSubmitBonus={handleSubmitBonus}
      handleSubmitClick={handleSubmitClick}
      handleSuccessModalClose={handleSuccessModalClose}
      validateRequirements={validateRequirements}
      isLoading={isLoading}
      errorsManager={errorsManager}
      setIsModalOpenRequirements={setIsModalOpenRequirements}
      isModalOpenRequirements={isModalOpenRequirements}
      showInfoModal={showInfoModal}
      handleBackClick={handleBackClick}
      handleCancelNavigation={handleCancelNavigation}
      handleNextClick={handleConfirmNavigation}
      isTablet={isTablet}
      lang={lang}
    />
  );
}
