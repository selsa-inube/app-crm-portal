import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

import { useMediaQuery } from "@inubekit/inubekit";

import { getLinesOfCreditByMoneyDestination } from "@services/lineOfCredit/getLinesOfCreditByMoneyDestination";
import { ILinesOfCreditByMoneyDestination } from "@services/lineOfCredit/types";
import { GetSearchAllPaymentChannels } from "@services/payment-channels/SearchAllPaymentChannelsByIdentificationNumber";
import { IResponsePaymentDatesChannel } from "@services/payment-channels/SearchAllPaymentChannelsByIdentificationNumber/types";
import { getCreditLineGeneralTerms } from "@services/lineOfCredit/generalTerms/getCreditLineGeneralTerms";
import { CreditLineGeneralTerms } from "@services/lineOfCredit/types";

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
  const [generalTerms, setGeneralTerms] =
    useState<CreditLineGeneralTerms | null>(null);
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
              minAmount: line.minAmount,
              maxAmount: line.maxAmount,
              minTerm: line.minTerm,
              maxTerm: line.maxTerm,
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

      const availableLines = Object.keys(result);
      if (availableLines.length === 1) {
        const singleLine = availableLines[0];
        setFormData((prev) => ({
          ...prev,
          creditLine: singleLine,
          selectedProducts: [singleLine],
        }));
      }
    })();
  }, [businessUnitPublicCode]);

  useEffect(() => {
    if (!formData.creditLine || !customerData?.publicCode) return;

    const fetchGeneralTerms = async () => {
      try {
        setLoading(true);
        const terms = await getCreditLineGeneralTerms(
          businessUnitPublicCode,
          businessManagerCode,
          customerData.publicCode,
          eventData.token,
          formData.creditLine,
          moneyDestination,
        );
        if (Array.isArray(terms)) {
          setGeneralTerms(
            (terms as CreditLineGeneralTerms[]).find(
              (term) => term.abbreviateName === formData.creditLine,
            ) || null,
          );
        }
        if (terms) {
          setGeneralTerms(terms);
        }
      } catch (error) {
        const err = error as {
          message?: string;
          status: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + err?.message + (err?.data?.description || "");

        setLoading(false);
        setErrorMessage(description);
        setErrorModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneralTerms();
  }, [
    formData.creditLine,
    businessUnitPublicCode,
    businessManagerCode,
    customerData?.publicCode,
    eventData.token,
    moneyDestination,
  ]);

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
        setIsCurrentFormValid(formData.selectedProducts.length > 0);
      }

      if (currentStep === stepsAddProduct.paymentConfiguration.id) {
        const isValid =
          !!formData.paymentConfiguration.paymentMethod &&
          !!formData.paymentConfiguration.paymentCycle &&
          !!formData.paymentConfiguration.firstPaymentDate;
        setIsCurrentFormValid(isValid);
      }
    };

    validateCurrentStep();
  }, [formData.selectedProducts, formData.paymentConfiguration, currentStep]);

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
    creditAmount: Yup.number()
      .min(
        generalTerms?.minAmount || 0,
        `Mínimo: $${generalTerms?.minAmount?.toLocaleString()}`,
      )
      .max(
        generalTerms?.maxAmount || Infinity,
        `Máximo: $${generalTerms?.maxAmount?.toLocaleString()}`,
      )
      .required("El monto es obligatorio"),
    maximumTermValue: Yup.string()
      .min(generalTerms?.minTerm || 0, `Mínimo: ${generalTerms?.minTerm} meses`)
      .max(
        generalTerms?.maxTerm || Infinity,
        `Máximo: ${generalTerms?.maxTerm} meses`,
      )
      .required("El plazo es obligatorio"),
    paymentConfiguration: Yup.object({
      paymentMethod: Yup.string(),
      paymentCycle: Yup.string(),
      firstPaymentDate: Yup.string(),
    }),
    selectedProducts: Yup.array().of(Yup.string().required()).required(),
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
      dataProspect={dataProspect}
      eventData={eventData}
      generalTerms={generalTerms}
    />
  );
}

export { AddProductModal };
