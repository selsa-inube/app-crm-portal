import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

import { useMediaQuery } from "@inubekit/inubekit";

import { getLinesOfCreditByMoneyDestination } from "@services/lineOfCredit/getLinesOfCreditByMoneyDestination";
import { ILinesOfCreditByMoneyDestination } from "@services/lineOfCredit/types";
import { GetSearchAllPaymentChannels } from "@services/payment-channels/SearchAllPaymentChannelsByIdentificationNumber";
import { IResponsePaymentDatesChannel } from "@services/payment-channels/SearchAllPaymentChannelsByIdentificationNumber/types";

import {
  IAddProductModalProps,
  TCreditLineTerms,
  IFormValues,
  stepsAddProduct,
  errorMessages,
  extractBorrowerIncomeData,
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
    dataProspect,
    lang,
    isLoading,
    eventData,
  } = props;
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [creditLineTerms, setCreditLineTerms] = useState<TCreditLineTerms>({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(
    stepsAddProduct.creditLineSelection.id,
  );
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(false);
  const [formData, setFormData] = useState<IFormValues>({
    creditLine: "",
    creditAmount: 0,
    paymentConfiguration: {
      paymentMethod: "",
      paymentCycle: "",
      firstPaymentDate: "",
      paymentChannelData: [],
    },
    quotaCapValue: 0,
    maximumTermValue: 0,
    quotaCapEnabled: true,
    maximumTermEnabled: false,
    selectedProducts: [],
  });

  useEffect(() => {
    (async () => {
      const clientInfo =
        customerData?.generalAttributeClientNaturalPersons?.[0];
      if (!clientInfo?.associateType || customerData === undefined) return;

      setLoading(true);

      const lineOfCreditValues = await getLinesOfCreditByMoneyDestination(
        businessUnitPublicCode,
        businessManagerCode,
        moneyDestination,
        customerData!.publicCode,
        eventData.token,
      );

      const linesArray = Array.isArray(lineOfCreditValues)
        ? lineOfCreditValues
        : [lineOfCreditValues];

      const existingAbbreviatedNames: string[] =
        dataProspect?.creditProducts?.map(
          (product) => product.lineOfCreditAbbreviatedName,
        ) ?? [];

      const result: TCreditLineTerms = {};

      linesArray.forEach((line: ILinesOfCreditByMoneyDestination) => {
        if (line?.abbreviateName) {
          const isAlreadyPresent = existingAbbreviatedNames.includes(
            line.abbreviateName,
          );

          if (!isAlreadyPresent) {
            result[line.abbreviateName] = {
              LoanAmountLimit: line.maxAmount,
              LoanTermLimit: line.maxTerm,
              RiskFreeInterestRate: line.maxEffectiveInterestRate,
              amortizationType: line.amortizationType,
              description: line.description,
            };
          }
        }
      });

      setLoading(false);
      setCreditLineTerms(result);
    })();
  }, [businessUnitPublicCode]);

  useEffect(() => {
    if (currentStep !== stepsAddProduct.paymentConfiguration.id) return;
    const loadPaymentOptions = async () => {
      if (!formData.creditLine || !customerData?.publicCode) return;

      try {
        const incomeData = extractBorrowerIncomeData(dataProspect);

        const paymentChannelRequest = {
          clientIdentificationNumber: customerData.publicCode,
          clientIdentificationType:
            customerData.generalAttributeClientNaturalPersons[0]
              .typeIdentification,
          moneyDestination: moneyDestination,
          ...incomeData,
          linesOfCredit: formData.selectedProducts,
        };

        setLoading(true);

        const response = await GetSearchAllPaymentChannels(
          businessUnitPublicCode,
          businessManagerCode,
          paymentChannelRequest,
          eventData.token,
        );

        if (!response || response.length === 0) {
          throw new Error(errorMessages.getPaymentMethods.i18n[lang]);
        }
        setLoading(false);
        setFormData((prev) => ({
          ...prev,
          paymentConfiguration: {
            ...prev.paymentConfiguration,
            paymentChannelData: response as IResponsePaymentDatesChannel[],
          },
        }));
      } catch (error) {
        setErrorMessage(errorMessages.getPaymentMethods.i18n[lang]);
        setErrorModal(true);
        setLoading(false);
      }
    };

    loadPaymentOptions();
  }, [currentStep]);

  useEffect(() => {
    const validateCurrentStep = () => {
      if (currentStep === stepsAddProduct.creditLineSelection.id) {
        const isValid = formData.selectedProducts.length > 0;
        setIsCurrentFormValid(isValid);
      } else if (currentStep === stepsAddProduct.paymentConfiguration.id) {
        const isValid =
          !!formData.paymentConfiguration.paymentMethod &&
          !!formData.paymentConfiguration.paymentCycle &&
          !!formData.paymentConfiguration.firstPaymentDate;
        setIsCurrentFormValid(isValid);
      }
    };

    validateCurrentStep();
  }, [formData, currentStep]);

  const isMobile = useMediaQuery("(max-width: 550px)");

  const steps = useMemo(() => {
    return Object.values(stepsAddProduct).map((step) => ({
      ...step,
      name: step.name.i18n[lang],
      description: step.description.i18n[lang],
    }));
  }, [lang]);

  const currentStepsNumber = steps.find(
    (step: { number: number }) => step.number === currentStep,
  ) || { id: 0, number: 0, name: "", description: "" };

  const handleNextStep = () => {
    if (currentStep === stepsAddProduct.creditLineSelection.id) {
      setCurrentStep(stepsAddProduct.paymentConfiguration.id);
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    setIsCurrentFormValid(true);
  };

  const handleSubmitClick = () => {
    onConfirm(formData);
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
      loading={loading}
      prospectData={{
        lineOfCredit: formData.creditLine,
        moneyDestination: moneyDestination,
      }}
      errorMessage={errorMessage}
      setErrorModal={setErrorModal}
      errorModal={errorModal}
      isLoading={isLoading}
      lang={lang}
    />
  );
}

export { AddProductModal };
