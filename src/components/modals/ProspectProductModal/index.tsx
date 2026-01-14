import { Formik, FormikValues, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import { MdAttachMoney, MdPercent } from "react-icons/md";
import {
  Stack,
  Icon,
  useMediaQuery,
  Select,
  Textfield,
} from "@inubekit/inubekit";
import { useState, useEffect, useContext } from "react";

import { BaseModal } from "@components/modals/baseModal";
import { postBusinessUnitRules } from "@services/businessUnitRules/EvaluteRuleByBusinessUnit";
import { getPaymentMethods } from "@services/prospect/getPaymentMethods";
import { IBusinessUnitRules } from "@services/businessUnitRules/types";
import {
  IPaymentMethod,
  IPaymentCycle,
  IFirstPaymentCycle,
} from "@services/prospect/getPaymentMethods/types";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import { getEffectiveInterestRate } from "@services/prospect/getEffectiveInterestRate";
import { CustomerContext } from "@context/CustomerContext";
import { paymentCycleMap } from "@pages/prospect/outlets/CardCommercialManagement/config/config";
import { validateIncrement } from "@services/prospect/validateIncrement";
import { IValidateIncrementRequest } from "@services/prospect/validateIncrement/types";
import { CardGray } from "@components/cards/CardGray";
import { capitalizeFirstLetter } from "@utils/formatData/text";
import { validateCurrencyFieldTruncate } from "@utils/formatData/currency";

import { ScrollableContainer } from "./styles";
import {
  interestRateTypeMap,
  termInMonthsOptions,
  amortizationTypeOptions,
  rateTypeOptions,
  VALIDATED_NUMBER_REGEX,
  messagesErrorValidations,
  fieldLabels,
  fieldPlaceholders,
  validationMessages,
  REPAYMENT_STRUCTURES_WITH_INCREMENT,
  repaymentStructureMap,
} from "./config";
import { TruncatedText } from "../TruncatedTextModal";

interface EditProductModalProps {
  onCloseModal: () => void;
  onConfirm: (values: FormikValues) => void;
  title: string;
  confirmButtonText: string;
  initialValues: FormikValues;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  isProcessingServices: boolean;
  prospectData: {
    lineOfCredit: string;
    moneyDestination: string;
    paymentChannelType?: string;
  };
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
}

function EditProductModal(props: EditProductModalProps) {
  const {
    onCloseModal,
    onConfirm,
    title,
    confirmButtonText,
    initialValues,
    iconAfter,
    businessUnitPublicCode,
    businessManagerCode,
    prospectData,
    setShowErrorModal,
    setMessageError,
    isProcessingServices,
  } = props;

  const [showIncrementField, setShowIncrementField] = useState<boolean>(false);
  const [incrementType, setIncrementType] = useState<
    "value" | "percentage" | null
  >(null);
  const [incrementValue, setIncrementValue] = useState<string>("");
  const [incrementError, setIncrementError] = useState<string>("");
  const [isValidatingIncrement, setIsValidatingIncrement] =
    useState<boolean>(false);
  const [creditAmountModified, setCreditAmountModified] =
    useState<boolean>(false);
  const [termInMonthsModified, setTermInMonthsModified] =
    useState<boolean>(false);
  const [loanAmountError, setLoanAmountError] = useState<string>("");
  const [paymentMethodsList, setPaymentMethodsList] = useState<
    IPaymentMethod[]
  >([]);
  const [paymentCyclesList, setPaymentCyclesList] = useState<IPaymentCycle[]>(
    [],
  );
  const [firstPaymentCyclesList, setFirstPaymentCyclesList] = useState<
    IFirstPaymentCycle[]
  >([]);

  const [loanTermError, setLoanTermError] = useState<string>("");
  const [amortizationTypesList, setAmortizationTypesList] = useState<
    { id: string; value: string; label: string }[]
  >([]);
  const [isLoadingAmortizationTypes, setIsLoadingAmortizationTypes] =
    useState(false);
  const [interestRateError, setInterestRateError] = useState<string>("");
  const [rateTypesList, setRateTypesList] = useState<
    { id: string; value: string; label: string }[]
  >([]);
  const [isLoadingRateTypes, setIsLoadingRateTypes] = useState(false);

  const isMobile = useMediaQuery("(max-width: 550px)");
  const { customerData } = useContext(CustomerContext);

  useEffect(() => {
    const loadPaymentOptions = async () => {
      try {
        const response = await getPaymentMethods(
          businessUnitPublicCode,
          businessManagerCode,
          initialValues.creditLine,
        );

        if (!response) {
          throw new Error(messagesErrorValidations.loadPaymentOptions);
        }

        setPaymentMethodsList(response.paymentMethods);
        const mappedPaymentCycles = response.paymentCycles.map((cycle) => ({
          ...cycle,
          label: paymentCycleMap[cycle.value] || cycle.label,
        }));
        paymentMethodsList;
        setPaymentCyclesList(mappedPaymentCycles);
        paymentCyclesList;

        const mappedFirstPaymentCycles = response.firstPaymentCycles.map(
          (cycle) => ({
            ...cycle,
            label: paymentCycleMap[cycle.value] || cycle.label,
          }),
        );
        setFirstPaymentCyclesList(mappedFirstPaymentCycles);
        firstPaymentCyclesList;
      } catch (error) {
        setPaymentMethodsList([
          {
            id: "0",
            value: "No hay opciones de pago disponibles",
            label: "No hay opciones de pago disponibles",
          },
        ]);

        setPaymentCyclesList([
          {
            id: "0",
            value: "No hay opciones de pago disponibles",
            label: "No hay opciones de pago disponibles",
          },
        ]);

        setFirstPaymentCyclesList([
          {
            id: "0",
            value: "No hay opciones de pago disponibles",
            label: "No hay opciones de pago disponibles",
          },
        ]);
      }
    };

    loadPaymentOptions();
  }, [businessUnitPublicCode, businessManagerCode, initialValues.creditLine]);

  useEffect(() => {
    const loadAmortizationTypes = async () => {
      setIsLoadingAmortizationTypes(true);

      try {
        const payload: IBusinessUnitRules = {
          ruleName: "RepaymentStructure",
          conditions: [
            { condition: "LineOfCredit", value: prospectData.lineOfCredit },
          ],
        };

        const decisions = await postBusinessUnitRules(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
        );

        if (decisions && Array.isArray(decisions) && decisions.length > 0) {
          const options = decisions
            .filter((decision) => typeof decision.value === "string")
            .map((decision, index) => ({
              id: decision.decisionId || `${index}`,
              value: decision.value as string,
              label:
                repaymentStructureMap[decision.value as string] ||
                (decision.value as string),
            }));
          setAmortizationTypesList(options);
        } else {
          setAmortizationTypesList(amortizationTypeOptions);
        }
      } catch (error) {
        setAmortizationTypesList(amortizationTypeOptions);
      } finally {
        setIsLoadingAmortizationTypes(false);
      }
    };

    loadAmortizationTypes();
  }, [businessUnitPublicCode, businessManagerCode, prospectData]);

  useEffect(() => {
    const loadRateTypes = async () => {
      setIsLoadingRateTypes(true);

      try {
        const payload: IBusinessUnitRules = {
          ruleName: "InterestRateType",
          conditions: [
            { condition: "LineOfCredit", value: prospectData.lineOfCredit },
            {
              condition: "MoneyDestination",
              value: prospectData.moneyDestination,
            },
          ],
        };

        const decisions = await postBusinessUnitRules(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
        );

        if (decisions && Array.isArray(decisions) && decisions.length > 0) {
          const options = decisions
            .filter((decision) => typeof decision.value === "string")
            .map((decision, index) => ({
              id: decision.decisionId || `${index}`,
              value: decision.value as string,
              label:
                interestRateTypeMap[decision.value as string] ||
                (decision.value as string),
            }));
          setRateTypesList(options);
        } else {
          setRateTypesList(rateTypeOptions);
        }
      } catch (error) {
        setRateTypesList(rateTypeOptions);
      } finally {
        setIsLoadingRateTypes(false);
      }
    };

    loadRateTypes();
  }, [businessUnitPublicCode, businessManagerCode, prospectData]);

  const isCreditAmountDisabled = (): boolean => {
    return termInMonthsModified;
  };

  const isTermInMonthsDisabled = (): boolean => {
    return creditAmountModified;
  };

  const handleSelectChange = (
    formik: FormikProps<FormikValues>,
    fieldName: string,
    name: string,
    value: string,
  ) => {
    formik.setFieldValue(name, value);

    const initialValue = initialValues[name];
    if (fieldName === "termInMonths") {
      if (value === initialValue) {
        setTermInMonthsModified(false);
        setLoanTermError("");
      } else {
        setTermInMonthsModified(true);

        const numericValue = Number(value);
        const currentAmount = Number(formik.values.creditAmount) || 0;

        if (numericValue >= 0 && currentAmount >= 0) {
          validateLoanTerm(numericValue, currentAmount);
        } else {
          setLoanTermError("");
        }
      }
    }
  };

  const handleTextChange = (
    formik: FormikProps<FormikValues>,
    fieldName: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    formik.handleChange(event);

    const newValue = event.target.value;
    const initialValue = initialValues[fieldName];

    const newNumericValue = Number(newValue);
    const initialNumericValue = Number(initialValue);

    if (fieldName === "interestRate") {
      if (newValue === "" || newNumericValue === initialNumericValue) {
        setInterestRateError("");
      } else {
        const numericValue = Number(newValue);
        const currentAmount = Number(formik.values.creditAmount) || 0;
        const currentTerm = Number(formik.values.termInMonths) || 0;

        if (numericValue >= 0 && currentAmount >= 0 && currentTerm >= 0) {
          validateInterestRate(numericValue);
        } else {
          setInterestRateError("");
        }
      }
    }
  };

  const validateLoanAmount = async (amount: number): Promise<void> => {
    try {
      setLoanAmountError("");

      const payload: IBusinessUnitRules = {
        ruleName: "LoanAmountLimit",
        conditions: [
          { condition: "LineOfCredit", value: prospectData.lineOfCredit },
          {
            condition: "MoneyDestination",
            value: prospectData.moneyDestination,
          },
        ],
      };

      const decisions = await postBusinessUnitRules(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
      );

      if (decisions && Array.isArray(decisions) && decisions.length > 0) {
        const decision = decisions[0];

        if (typeof decision.value === "object" && decision.value !== null) {
          const { from, to } = decision.value;

          if (amount < from || amount > to) {
            setLoanAmountError(
              validationMessages.loanAmountOutOfRange(amount, from, to),
            );
          }
        } else if (typeof decision.value === "string") {
          const maxAmount = Number(decision.value);

          if (!isNaN(maxAmount) && amount > maxAmount) {
            setLoanAmountError(
              validationMessages.loanAmountExceedsMax(amount, maxAmount),
            );
          }
        }
      } else {
        setLoanAmountError(validationMessages.loanAmountValidationFailed);
      }
    } catch (error) {
      setLoanAmountError(messagesErrorValidations.validateLoanAmount);
    }
  };

  const validateLoanTerm = async (
    term: number,
    loanAmount: number,
  ): Promise<void> => {
    try {
      setLoanTermError("");

      const payload: IBusinessUnitRules = {
        ruleName: "LoanTerm",
        conditions: [
          { condition: "LineOfCredit", value: prospectData.lineOfCredit },
          {
            condition: "MoneyDestination",
            value: prospectData.moneyDestination,
          },
          { condition: "LoanAmount", value: loanAmount },
        ],
      };

      const decisions = await postBusinessUnitRules(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
      );

      if (decisions && Array.isArray(decisions) && decisions.length > 0) {
        const decision = decisions[0];

        if (typeof decision.value === "object" && decision.value !== null) {
          const { from, to } = decision.value;

          if (term < from || term > to) {
            setLoanTermError(
              validationMessages.loanTermOutOfRange(term, from, to),
            );
          }
        } else if (typeof decision.value === "string") {
          const rangeParts = decision.value.split("-");
          if (rangeParts.length === 2) {
            const [min, max] = rangeParts.map(Number);
            if (!isNaN(min) && !isNaN(max) && (term < min || term > max)) {
              setLoanTermError(
                validationMessages.loanTermOutOfRange(term, min, max),
              );
            }
          }
        }
      } else {
        setLoanTermError(validationMessages.loanTermValidationFailed);
      }
    } catch (error) {
      setLoanTermError(validationMessages.loanTermValidationError);
    }
  };

  const validateInterestRate = async (rate: number): Promise<void> => {
    try {
      setInterestRateError("");

      const response = await getEffectiveInterestRate(
        businessUnitPublicCode,
        businessManagerCode,
        initialValues.creditLine,
        customerData.publicCode,
      );

      const periodicInterestRateMin = response?.periodicInterestRateMin || 0;
      const periodicInterestRateMax = response?.periodicInterestRateMax || 2;

      if (rate <= periodicInterestRateMin || rate >= periodicInterestRateMax) {
        setInterestRateError(
          validationMessages.interestRateOutOfRange(
            rate,
            periodicInterestRateMin,
            periodicInterestRateMax,
          ),
        );
      }
    } catch (error) {
      setInterestRateError(validationMessages.interestRateValidationError);
    }
  };

  const handleCurrencyChange = (
    formik: FormikProps<FormikValues>,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleChangeWithCurrency(formik, event);

    const rawValue = event.target.value.replace(VALIDATED_NUMBER_REGEX, "");
    const numericValue = Number(rawValue);

    const initialAmount = initialValues.creditAmount;

    if (numericValue === initialAmount || rawValue === "") {
      setCreditAmountModified(false);
      setLoanAmountError("");
    } else {
      setCreditAmountModified(true);

      if (numericValue > 0) {
        validateLoanAmount(numericValue);
      } else {
        setLoanAmountError("");
      }
    }
  };

  const handleSelectFocus = (fieldId: string) => {
    setTimeout(() => {
      const element = document.getElementById(fieldId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }, 100);
  };

  const handleAmortizationTypeChange = (
    formik: FormikProps<FormikValues>,
    name: string,
    value: string,
  ) => {
    formik.setFieldValue(name, value);

    if (value === REPAYMENT_STRUCTURES_WITH_INCREMENT.VALUE_INCREMENT) {
      setShowIncrementField(true);
      setIncrementType("value");
      setIncrementValue("");
      setIncrementError("");
    } else if (
      value === REPAYMENT_STRUCTURES_WITH_INCREMENT.PERCENTAGE_INCREMENT
    ) {
      setShowIncrementField(true);
      setIncrementType("percentage");
      setIncrementValue("");
      setIncrementError("");
    } else {
      setShowIncrementField(false);
      setIncrementType(null);
      setIncrementValue("");
      setIncrementError("");
    }
  };

  const validateIncrementValue = async (
    value: string,
    formik: FormikProps<FormikValues>,
  ): Promise<void> => {
    if (!incrementType || !value) {
      setIncrementError("");
      return;
    }

    setIsValidatingIncrement(true);

    try {
      const numericValue = Number(value.replace(/[^0-9.]/g, ""));

      if (isNaN(numericValue) || numericValue <= 0) {
        setIncrementError(validationMessages.incrementMustBePositive);
        return;
      }

      const payload: IValidateIncrementRequest = {
        lineOfCredit: prospectData.lineOfCredit,
        moneyDestination: prospectData.moneyDestination,
        amortizationType: formik.values.amortizationType,
        incrementType: incrementType,
        incrementValue: numericValue,
        loanAmount: Number(formik.values.creditAmount) || 0,
      };

      const response = await validateIncrement(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
      );

      if (!response.isValid) {
        if (incrementType === "value") {
          setIncrementError(
            validationMessages.incrementValueRange(
              response.minValue,
              response.maxValue,
            ),
          );
        } else {
          setIncrementError(
            validationMessages.incrementPercentageRange(
              response.minValue,
              response.maxValue,
            ),
          );
        }
      } else {
        setIncrementError("");
      }
    } catch (error) {
      setIncrementError(validationMessages.incrementValidationError);
    } finally {
      setIsValidatingIncrement(false);
    }
  };

  const onSubmitHandler = (
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>,
  ) => {
    try {
      const submitValues = {
        ...values,
        ...(showIncrementField &&
          incrementValue && {
            incrementValue: Number(incrementValue.replace(/[^0-9.]/g, "")),
            incrementType: incrementType,
          }),
      };

      onConfirm(submitValues);
    } catch (error) {
      const err = error as {
        message?: string;
        status?: number;
        data?: { description?: string; code?: string };
      };

      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description =
        code + (err?.message || "") + (err?.data?.description || "");

      setShowErrorModal(true);
      setMessageError(description);
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    creditLine: Yup.string(),
    creditAmount: Yup.number(),
    paymentMethod: Yup.string(),
    paymentCycle: Yup.string(),
    firstPaymentCycle: Yup.string(),
    termInMonths: Yup.number(),
    amortizationType: Yup.string(),
    interestRate: Yup.number().min(0, ""),
    rateType: Yup.string(),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(
        values: FormikValues,
        formikHelpers: FormikHelpers<FormikValues>,
      ) => {
        onConfirm(values);
        formikHelpers.setSubmitting(false);
        onSubmitHandler(values, formikHelpers);
      }}
    >
      {(formik) => (
        <BaseModal
          title={
            <TruncatedText
              text={title}
              maxLength={25}
              size="small"
              type="headline"
            />
          }
          backButton="Cancelar"
          nextButton={confirmButtonText}
          handleNext={formik.submitForm}
          handleBack={onCloseModal}
          disabledNext={
            !formik.dirty ||
            !formik.isValid ||
            !!loanAmountError ||
            !!loanTermError ||
            !!interestRateError ||
            !!incrementError ||
            isValidatingIncrement ||
            (showIncrementField && !incrementValue)
          }
          iconAfterNext={iconAfter}
          finalDivider={true}
          width={isMobile ? "290px" : "500px"}
          isLoading={isProcessingServices}
        >
          <ScrollableContainer
            $smallScreen={isMobile}
            showIncrementField={showIncrementField}
          >
            <Stack
              direction="column"
              gap="24px"
              width="100%"
              height={isMobile ? "auto" : "600px"}
              margin="0px 0px 30px 0"
            >
              <Textfield
                label={fieldLabels.creditAmount}
                name="creditAmount"
                id="creditAmount"
                placeholder="Monto solicitado"
                value={validateCurrencyField("creditAmount", formik, false, "")}
                status={loanAmountError ? "invalid" : undefined}
                message={loanAmountError}
                iconBefore={
                  <Icon
                    icon={<MdAttachMoney />}
                    appearance="success"
                    size="18px"
                    spacing="narrow"
                  />
                }
                size="compact"
                onBlur={formik.handleBlur}
                onChange={(event) => handleCurrencyChange(formik, event)}
                fullwidth
                disabled={isCreditAmountDisabled()}
              />
              <CardGray
                label={"Medio de pago"}
                placeHolder={capitalizeFirstLetter(
                  formik.values.paymentMethod.charAt(0).toUpperCase() +
                    formik.values.paymentMethod.slice(1),
                )}
              />
              <CardGray
                label={"Ciclo de pagos"}
                placeHolder={capitalizeFirstLetter(
                  paymentCycleMap[formik.values.paymentCycle] ||
                    formik.values.paymentCycle,
                )}
              />
              <Select
                label="Plazo en meses"
                name="termInMonths"
                id="termInMonths"
                size="compact"
                placeholder="Selecciona una opción"
                options={termInMonthsOptions}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "termInMonths", name, value)
                }
                value={
                  formik.values.termInMonths % 1 !== 0
                    ? formik.values.termInMonths.toFixed(4)
                    : formik.values.termInMonths
                }
                fullwidth
                message={loanTermError}
                invalid={loanTermError ? true : false}
                disabled={isTermInMonthsDisabled()}
              />
              <Select
                label="Tipo de amortización"
                name="amortizationType"
                id="amortizationType"
                size="compact"
                placeholder="Selecciona una opción"
                options={amortizationTypesList}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleAmortizationTypeChange(formik, name, value)
                }
                value={formik.values.amortizationType}
                fullwidth
                disabled={isLoadingAmortizationTypes}
              />
              {showIncrementField && (
                <Textfield
                  label={
                    incrementType === "value"
                      ? fieldLabels.incrementValue
                      : fieldLabels.incrementPercentage
                  }
                  name="incrementValue"
                  id="incrementValue"
                  placeholder={
                    incrementType === "value"
                      ? fieldPlaceholders.incrementValue
                      : fieldPlaceholders.incrementPercentage
                  }
                  value={incrementValue}
                  status={
                    incrementError
                      ? "invalid"
                      : isValidatingIncrement
                        ? "pending"
                        : undefined
                  }
                  message={
                    incrementError ||
                    (isValidatingIncrement
                      ? validationMessages.incrementValidating
                      : "")
                  }
                  iconBefore={
                    incrementType === "value" ? (
                      <Icon
                        icon={<MdAttachMoney />}
                        appearance="success"
                        size="18px"
                        spacing="narrow"
                      />
                    ) : (
                      <Icon
                        icon={<MdPercent />}
                        appearance="dark"
                        size="18px"
                        spacing="narrow"
                      />
                    )
                  }
                  type="number"
                  size="compact"
                  onChange={(event) => {
                    const value = event.target.value;
                    setIncrementValue(value);

                    const timeoutId = setTimeout(() => {
                      validateIncrementValue(value, formik);
                    }, 500);

                    return () => clearTimeout(timeoutId);
                  }}
                  onBlur={() => validateIncrementValue(incrementValue, formik)}
                  fullwidth
                />
              )}
              <Textfield
                label="Tasa de interés"
                name="interestRate"
                id="interestRate"
                placeholder="Ej: 0.9"
                value={Number(formik.values.interestRate).toFixed(4)}
                iconAfter={
                  <Icon
                    icon={<MdPercent />}
                    appearance="dark"
                    size="18px"
                    spacing="narrow"
                  />
                }
                type="number"
                size="compact"
                onBlur={formik.handleBlur}
                onChange={(event) =>
                  handleTextChange(formik, "interestRate", event)
                }
                fullwidth
                message={interestRateError}
                status={interestRateError ? "invalid" : undefined}
              />
              <Select
                label="Tipo de tasa"
                name="rateType"
                id="rateType"
                size="compact"
                placeholder="Selecciona una opción"
                options={rateTypesList}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "rateType", name, value)
                }
                onFocus={() => handleSelectFocus("rateType")}
                value={formik.values.rateType}
                fullwidth
                disabled={isLoadingRateTypes}
              />
              <Textfield
                label="Monto de la cuota"
                name="installmentAmount"
                id="installmentAmount"
                placeholder="Ej: 500.0000"
                value={validateCurrencyFieldTruncate(
                  "installmentAmount",
                  formik,
                  false,
                  "",
                )}
                iconBefore={
                  <Icon
                    icon={<MdAttachMoney />}
                    appearance="success"
                    size="18px"
                    spacing="narrow"
                  />
                }
                type="text"
                size="compact"
                onBlur={formik.handleBlur}
                onChange={(event) => handleCurrencyChange(formik, event)}
                fullwidth
                message={interestRateError}
                status={interestRateError ? "invalid" : undefined}
              />
            </Stack>
          </ScrollableContainer>
        </BaseModal>
      )}
    </Formik>
  );
}

export { EditProductModal };
export type { EditProductModalProps };
