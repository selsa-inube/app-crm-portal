import { useEffect, useState } from "react";
import { useFlag, useMediaQuery } from "@inubekit/inubekit";

import { getIncomeSourcesById } from "@services/incomeSources";
import { IIncomeSources } from "@services/incomeSources/types";

import { stepsAddBorrower } from "./config/addBorrower.config";
import { DebtorAddModalUI } from "./interface";
import { FormData } from "./types";

interface DebtorAddModalProps {
  onSubmit: () => void;
  handleClose: () => void;
  title: string;
  businessUnitPublicCode?: string;
}
export function DebtorAddModal(props: DebtorAddModalProps) {
  const { title, handleClose, businessUnitPublicCode } = props;

  const [currentStep, setCurrentStep] = useState<number>(
    stepsAddBorrower.generalInformation.id,
  );
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      tipeOfDocument: "",
      documentNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      sex: "",
      age: "",
      relation: "",
    },
  });
  const [incomeData, setIncomeData] = useState<IIncomeSources | undefined>(
    undefined,
  );

  const { addFlag } = useFlag();

  const handleFlag = (error: unknown) => {
    addFlag({
      title: "Error Fuentes de ingreso",
      description: `Error al traer los datos: ${error}`,
      appearance: "danger",
      duration: 5000,
    });
  };

  const borrowerId = formData.personalInfo.documentNumber.toString();

  function capitalizeKeysExceptSome<T>(
    obj: Record<string, unknown>,
    exclude: string[] = [],
  ): T {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const newKey = exclude.includes(key)
        ? key
        : key.charAt(0).toUpperCase() + key.slice(1);

      result[newKey] = value;
    }

    return result as unknown as T;
  }

  useEffect(() => {
    if (!borrowerId) return;

    const fetchIncomeData = async () => {
      try {
        const response = await getIncomeSourcesById(
          borrowerId,
          businessUnitPublicCode || "",
        );
        const formattedData = capitalizeKeysExceptSome<IIncomeSources>(
          response as unknown as Record<string, unknown>,
          ["name", "surname", "identificationNumber", "identificationType"],
        );
        setIncomeData(formattedData);

        setFormData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            tipeOfDocument:
              formattedData?.identificationType ||
              prev.personalInfo.tipeOfDocument,
            documentNumber:
              formattedData?.identificationNumber ||
              prev.personalInfo.documentNumber,
            firstName: formattedData?.name || prev.personalInfo.firstName,
            lastName: formattedData?.surname || prev.personalInfo.lastName,
            email: prev.personalInfo.email,
            phone: prev.personalInfo.phone,
            sex: prev.personalInfo.sex,
            age: prev.personalInfo.age,
            relation: prev.personalInfo.relation,
          },
        }));
      } catch (error) {
        handleFlag(error);
      }
    };

    fetchIncomeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borrowerId]);

  const isMobile = useMediaQuery("(max-width:880px)");

  const steps = Object.values(stepsAddBorrower);

  const currentStepsNumber = steps.find(
    (step: { number: number }) => step.number === currentStep,
  ) || { id: 0, number: 0, name: "", description: "" };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setIsCurrentFormValid(true);
    }
  };

  function handleSubmitClick() {
    console.log("Enviar paso: ", currentStep);
  }

  const handleFormChange = (updatedValues: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedValues,
    }));
  };

  return (
    <DebtorAddModalUI
      steps={steps}
      currentStep={currentStep}
      isCurrentFormValid={isCurrentFormValid}
      setIsCurrentFormValid={setIsCurrentFormValid}
      formData={formData}
      incomeData={incomeData}
      handleFormChange={handleFormChange}
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
      setCurrentStep={setCurrentStep}
      currentStepsNumber={currentStepsNumber}
      handleSubmitClick={handleSubmitClick}
      handleClose={handleClose}
      title={title}
      isMobile={isMobile}
    />
  );
}
