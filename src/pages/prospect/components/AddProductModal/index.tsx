import { useEffect, useState } from "react";
import * as Yup from "yup";

import { useMediaQuery } from "@inubekit/inubekit";

import { getLinesOfCreditByMoneyDestination } from "@services/lineOfCredit/getLinesOfCreditByMoneyDestination";
import { ILinesOfCreditByMoneyDestination } from "@services/lineOfCredit/types";
import { getPaymentMethods } from "@services/prospect/getPaymentMethods";
import { paymentCycleMap } from "@pages/prospect/outlets/CardCommercialManagement/config/config";

import {
  IAddProductModalProps,
  TCreditLineTerms,
  IFormValues,
  stepsAddProduct,
  errorMessages,
} from "./config";
import { AddProductModalUI } from "./interface";

function AddProductModal(props: IAddProductModalProps) {
  const {
    onCloseModal,
    onConfirm,
    title,
    confirmButtonText,
    initialValues,
    iconBefore,
    iconAfter,
    moneyDestination,
    businessUnitPublicCode,
    customerData,
    businessManagerCode,
  } = props;

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [creditLineTerms, setCreditLineTerms] = useState<TCreditLineTerms>({});
  const [currentStep, setCurrentStep] = useState<number>(
    stepsAddProduct.creditLineSelection.id,
  );
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(true);
  const [formData, setFormData] = useState<IFormValues>({
    creditLine: "",
    creditAmount: 0,
    paymentConfiguration: {
      paymentMethod: "",
      paymentCycle: "",
      firstPaymentDate: "",
      availablePaymentMethods: [],
      availablePaymentCycles: [],
      availableFirstPaymentDates: [],
    },
    quotaCapValue: 0,
    maximumTermValue: 0,
    quotaCapEnabled: false,
    maximumTermEnabled: false,
    selectedProducts: [],
  });

  useEffect(() => {
    (async () => {
      const clientInfo =
        customerData?.generalAttributeClientNaturalPersons?.[0];
      if (!clientInfo?.associateType) return;

      const lineOfCreditValues = await getLinesOfCreditByMoneyDestination(
        businessUnitPublicCode,
        businessManagerCode,
        moneyDestination,
        customerData!.publicCode,
      );

      const linesArray = Array.isArray(lineOfCreditValues)
        ? lineOfCreditValues
        : [lineOfCreditValues];

      const result: TCreditLineTerms = {};

      linesArray.forEach((line: ILinesOfCreditByMoneyDestination) => {
        if (line && line.abbreviateName) {
          result[line.abbreviateName] = {
            LoanAmountLimit: line.maxAmount,
            LoanTermLimit: line.maxTerm,
            RiskFreeInterestRate: line.maxEffectiveInterestRate,
            amortizationType: line.amortizationType,
            description: line.description,
          };
        }
      });

      setCreditLineTerms(result);
    })();
  }, [businessUnitPublicCode]);

  useEffect(() => {
    const loadPaymentOptions = async () => {
      if (!formData.creditLine) return;

      try {
        const response = await getPaymentMethods(
          businessUnitPublicCode,
          businessManagerCode,
          formData.creditLine,
        );

        if (!response) {
          throw new Error(errorMessages.getPaymentMethods);
        }

        const mappedPaymentCycles = response.paymentCycles.map((cycle) => ({
          ...cycle,
          label: paymentCycleMap[cycle.value] || cycle.label,
        }));

        const mappedFirstPaymentCycles = response.firstPaymentCycles.map(
          (cycle) => ({
            ...cycle,
            label: paymentCycleMap[cycle.value] || cycle.label,
          }),
        );

        setFormData((prev) => ({
          ...prev,
          paymentConfiguration: {
            ...prev.paymentConfiguration,
            availablePaymentMethods: response.paymentMethods,
            availablePaymentCycles: mappedPaymentCycles,
            availableFirstPaymentDates: mappedFirstPaymentCycles,
          },
        }));

        if (
          response.paymentMethods.length === 1 &&
          mappedPaymentCycles.length === 1 &&
          mappedFirstPaymentCycles.length === 1
        ) {
          setFormData((prev) => ({
            ...prev,
            paymentConfiguration: {
              ...prev.paymentConfiguration,
              paymentMethod: response.paymentMethods[0].value,
              paymentCycle: mappedPaymentCycles[0].value,
              firstPaymentDate: mappedFirstPaymentCycles[0].value,
            },
          }));
        }
      } catch (error) {
        setFormData((prev) => ({
          ...prev,
          paymentConfiguration: {
            ...prev.paymentConfiguration,
            availablePaymentMethods: [
              {
                id: "0",
                value: "No hay opciones disponibles", // sorry for this, but that is only a mocks a witing to remove when we have the services working correctly :)
                label: "No hay opciones disponibles",
              },
            ],
            availablePaymentCycles: [
              {
                id: "0",
                value: "No hay opciones disponibles",
                label: "No hay opciones disponibles",
              },
            ],
            availableFirstPaymentDates: [
              {
                id: "0",
                value: "No hay opciones disponibles",
                label: "No hay opciones disponibles",
              },
            ],
          },
        }));

        setErrorMessage(errorMessages.getPaymentMethods);
        setErrorModal(true);
      }
    };

    loadPaymentOptions();
  }, [formData.creditLine, businessUnitPublicCode, businessManagerCode]);

  const isMobile = useMediaQuery("(max-width: 550px)");

  const steps = Object.values(stepsAddProduct);

  const currentStepsNumber = steps.find(
    (step: { number: number }) => step.number === currentStep,
  ) || { id: 0, number: 0, name: "", description: "" };

  const shouldSkipPaymentConfiguration = (): boolean => {
    const config = formData.paymentConfiguration;

    return (
      config.availablePaymentMethods.length === 1 &&
      config.availablePaymentCycles.length === 1 &&
      config.availableFirstPaymentDates.length === 1 &&
      config.paymentMethod !== "" &&
      config.paymentCycle !== "" &&
      config.firstPaymentDate !== ""
    );
  };

  const handleNextStep = () => {
    if (currentStep === stepsAddProduct.creditLineSelection.id) {
      if (shouldSkipPaymentConfiguration()) {
        setCurrentStep(stepsAddProduct.amountCapture.id);
      } else {
        setCurrentStep(stepsAddProduct.paymentConfiguration.id);
      }
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (
      currentStep === stepsAddProduct.amountCapture.id &&
      shouldSkipPaymentConfiguration()
    ) {
      setCurrentStep(stepsAddProduct.creditLineSelection.id);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    setIsCurrentFormValid(true);
  };

  const handleSubmitClick = () => {
    onConfirm(formData);
    onCloseModal();
  };

  const handleFormChange = (updatedValues: Partial<IFormValues>) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedValues,
    }));
  };

  const validationSchema = Yup.object({
    creditLine: Yup.string(),
    creditAmount: Yup.number(),
    paymentConfiguration: Yup.object({
      paymentMethod: Yup.string(),
      paymentCycle: Yup.string(),
      firstPaymentDate: Yup.string(),
    }),
    termInMonths: Yup.number(),
    selectedProducts: Yup.array()
      .of(Yup.string().required())
      .default([])
      .required(),
  });

  return (
    <AddProductModalUI
      title={title}
      confirmButtonText={confirmButtonText}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onConfirm={onConfirm}
      onCloseModal={onCloseModal}
      iconBefore={iconBefore}
      iconAfter={iconAfter}
      creditLineTerms={creditLineTerms}
      isMobile={isMobile}
      steps={steps}
      currentStep={currentStep}
      currentStepsNumber={currentStepsNumber}
      isCurrentFormValid={isCurrentFormValid}
      formData={formData}
      setIsCurrentFormValid={setIsCurrentFormValid}
      handleFormChange={handleFormChange}
      handleNextStep={handleNextStep}
      handlePreviousStep={handlePreviousStep}
      handleSubmitClick={handleSubmitClick}
      businessUnitPublicCode={businessUnitPublicCode}
      businessManagerCode={businessManagerCode}
      prospectData={{
        lineOfCredit: formData.creditLine,
        moneyDestination: moneyDestination,
      }}
      errorMessage={errorMessage}
      setErrorModal={setErrorModal}
      errorModal={errorModal}
    />
  );
}

export { AddProductModal };
