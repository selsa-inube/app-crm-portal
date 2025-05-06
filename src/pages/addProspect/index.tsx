import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@inubekit/inubekit";

import { Consulting } from "@components/modals/Consulting";
import { prospectId } from "@mocks/add-prospect/edit-prospect/prospectid.mock";
import { CustomerContext } from "@context/CustomerContext";

import { stepsAddProspect } from "./config/addProspect.config";
import { FormData } from "./types";
import { AddProspectUI } from "./interface";

export function AddProspect() {
  const [currentStep, setCurrentStep] = useState<number>(
    stepsAddProspect.generalInformation.id,
  );
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(true);
  const [showConsultingModal, setShowConsultingModal] = useState(false);
  const [isModalOpenRequirements, setIsModalOpenRequirements] = useState(false);

  const isMobile = useMediaQuery("(max-width:880px)");
  const isTablet = useMediaQuery("(max-width: 1482px)");

  const steps = Object.values(stepsAddProspect);
  const navigate = useNavigate();

  const { customerData } = useContext(CustomerContext);
  const { customerPublicCode } = useParams();

  const dataHeader = {
    name: customerData.fullName,
    status:
      customerData.generalAssociateAttributes[0].partnerStatus.substring(2),
  };

  const [formData, setFormData] = useState<FormData>({
    selectedDestination: "",
    selectedProducts: [],
    loanConditionState: {
      toggles: {
        quotaCapToggle: true,
        maximumTermToggle: false,
      },
      quotaCapValue: "",
      maximumTermValue: "",
    },
    generalToggleChecked: true,
    togglesState: [false, false, false],
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
    consolidatedCreditSelections: {
      totalCollected: 0,
      selectedValues: {},
    },
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const id = prospectId[0];

  const handleFormDataChange = (
    field: string,
    newValue: string | number | boolean,
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: newValue,
    }));
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
        selectedProducts: [],
        generalToggleChecked: true,
        togglesState: [false, false, false],
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
      togglesState[2] ? stepsAddProspect.extraBorrowers.id : undefined,
      togglesState[1] ? stepsAddProspect.sourcesIncome.id : undefined,
      stepsAddProspect.loanConditions.id,
    ].filter((step): step is number => step !== undefined);

    const currentStepIndex = dynamicSteps.indexOf(currentStep);

    if (currentStep === stepsAddProspect.loanConditions.id) {
      showConsultingForFiveSeconds();
    }
    if (currentStep === stepsAddProspect.sourcesIncome.id) {
      setCurrentStep(stepsAddProspect.obligationsFinancial.id);
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
      togglesState[2] ? stepsAddProspect.extraBorrowers.id : undefined,
      togglesState[1] ? stepsAddProspect.sourcesIncome.id : undefined,
      togglesState[1] ? stepsAddProspect.obligationsFinancial.id : undefined,
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
      navigate(`/credit/edit-prospect/${customerPublicCode}/${id.prospect}`);
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
        setIsModalOpenRequirements={setIsModalOpenRequirements}
        setIsCurrentFormValid={setIsCurrentFormValid}
        handleNextStep={handleNextStep}
        handlePreviousStep={handlePreviousStep}
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
