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
import { truncateTextToMaxLength } from "@utils/formatData/text";
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

import { interestRateTypeMap } from "./config";
import { ScrollableContainer } from "./styles";
import {
  termInMonthsOptions,
  amortizationTypeOptions,
  rateTypeOptions,
  VALIDATED_NUMBER_REGEX,
  messagesErrorValidations,
  repaymentStructureMap,
} from "./config";

interface EditProductModalProps {
  onCloseModal: () => void;
  onConfirm: (values: FormikValues) => void;
  title: string;
  confirmButtonText: string;
  initialValues: FormikValues;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  prospectData: {
    lineOfCredit: string;
    moneyDestination: string;
    paymentChannelType?: string;
  };
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
}

interface IRuleDecision {
  decisionId?: string;
  typeDecision?: string;
  value?: string | { from: number; to: number };
  ruleDataType?: "Alphabetical" | "Numerical" | "Range" | "Monetary";
  ruleName?: string;
  howToSetTheDecision?: string;
  coverage?: number;
  effectiveFrom?: string;
  validUntil?: string;
}

const REPAYMENT_STRUCTURES_WITH_INCREMENT = {
  VALUE_INCREMENT: "Pagos valor de incremento",
  PERCENTAGE_INCREMENT: "Pagos con porcentaje de incremento",
};

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
        setPaymentCyclesList(mappedPaymentCycles);

        const mappedFirstPaymentCycles = response.firstPaymentCycles.map(
          (cycle) => ({
            ...cycle,
            label: paymentCycleMap[cycle.value] || cycle.label,
          }),
        );
        setFirstPaymentCyclesList(mappedFirstPaymentCycles);
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

        const response = await postBusinessUnitRules(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
        );

        const decisions = response as unknown as IRuleDecision[];

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
        console.error("Error cargando tipos de amortización:", error);
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

        const response = await postBusinessUnitRules(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
        );

        const decisions = response as unknown as IRuleDecision[];

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
        console.error("Error cargando tipos de tasa:", error);
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

      const response = await postBusinessUnitRules(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
      );

      const decisions = response as unknown as IRuleDecision[];

      if (decisions && Array.isArray(decisions) && decisions.length > 0) {
        const decision = decisions[0];

        if (typeof decision.value === "object" && decision.value !== null) {
          const { from, to } = decision.value;

          if (amount < from || amount > to) {
            setLoanAmountError(
              `El monto ingresado es $${amount.toLocaleString()}. Debe estar entre $${from.toLocaleString()} y $${to.toLocaleString()}`,
            );
          }
        } else if (typeof decision.value === "string") {
          const maxAmount = Number(decision.value);

          if (!isNaN(maxAmount) && amount > maxAmount) {
            setLoanAmountError(
              `El monto ingresado es $${amount.toLocaleString()}. El máximo permitido es $${maxAmount.toLocaleString()}`,
            );
          }
        }
      } else {
        setLoanAmountError("No se pudo validar el monto del crédito");
      }
    } catch (error) {
      console.error("Error validando monto del crédito:", error);
      setLoanAmountError("Error al validar el monto del crédito");
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

      const response = await postBusinessUnitRules(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
      );

      const decisions = response as unknown as IRuleDecision[];

      if (decisions && Array.isArray(decisions) && decisions.length > 0) {
        const decision = decisions[0];

        if (typeof decision.value === "object" && decision.value !== null) {
          const { from, to } = decision.value;

          if (term < from || term > to) {
            setLoanTermError(
              `El plazo ingresado es ${term} meses. Debe estar entre ${from} y ${to} meses`,
            );
          }
        } else if (typeof decision.value === "string") {
          const rangeParts = decision.value.split("-");
          if (rangeParts.length === 2) {
            const [min, max] = rangeParts.map(Number);
            if (!isNaN(min) && !isNaN(max) && (term < min || term > max)) {
              setLoanTermError(
                `El plazo ingresado es ${term} meses. Debe estar entre ${min} y ${max} meses`,
              );
            }
          }
        }
      } else {
        setLoanTermError("No se pudo validar el plazo");
      }
    } catch (error) {
      console.error("Error validando plazo:", error);
      setLoanTermError("Error al validar el plazo");
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
          `La tasa ingresada es ${rate}% mensual. Debe estar entre ${periodicInterestRateMin.toFixed(2)}% y ${periodicInterestRateMax.toFixed(2)}% mensual`,
        );
      }
    } catch (error) {
      console.error("Error validando tasa de interés:", error);
      setInterestRateError("Error al validar la tasa de interés");
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

    // Verificar si la opción seleccionada requiere campo de incremento
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

  const validateIncrementValue = async (value: string): Promise<void> => {
    if (!incrementType || !value) {
      setIncrementError("");
      return;
    }

    setIsValidatingIncrement(true);

    try {
      const numericValue = Number(value.replace(/[^0-9.]/g, ""));

      if (isNaN(numericValue) || numericValue <= 0) {
        setIncrementError("El valor debe ser mayor a 0");
        return;
      }

      // TODO: Llamar al servicio cuando esté disponible
      const payload: IValidateIncrementRequest = {
        lineOfCredit: prospectData.lineOfCredit,
        moneyDestination: prospectData.moneyDestination,
        amortizationType: formik.values.amortizationType,
        incrementType: incrementType,
        incrementValue: numericValue,
        loanAmount: Number(ormik.values.creditAmount) || 0,
      };

      const response = await validateIncrement(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
      );

      if (!response.isValid) {
        if (incrementType === "value") {
          setIncrementError(
            `El valor debe estar entre $${response.minValue.toLocaleString()} y $${response.maxValue.toLocaleString()}`,
          );
        } else {
          setIncrementError(
            `El porcentaje debe estar entre ${response.minValue}% y ${response.maxValue}%`,
          );
        }
      } else {
        setIncrementError("");
      }
    } catch (error) {
      console.error("Error validando incremento:", error);
      setIncrementError("Error al validar el incremento");
    } finally {
      setIsValidatingIncrement(false);
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
      }}
    >
      {(formik) => (
        <BaseModal
          title={truncateTextToMaxLength(title, 25)}
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
        >
          <ScrollableContainer $smallScreen={isMobile}>
            <Stack
              direction="column"
              gap="24px"
              width="100%"
              height={isMobile ? "auto" : "600px"}
              margin="0px 0px 30px 0"
            >
              <Textfield
                label="Monto del crédito"
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
              <Select
                label="Medio de pago"
                name="paymentMethod"
                id="paymentMethod"
                size="compact"
                placeholder="Selecciona una opción"
                options={paymentMethodsList}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "paymentMethod", name, value)
                }
                value={
                  formik.values.paymentMethod.charAt(0).toUpperCase() +
                  formik.values.paymentMethod.slice(1)
                }
                fullwidth
                disabled={true}
              />
              <Select
                label="Ciclo de pagos"
                name="paymentCycle"
                id="paymentCycle"
                size="compact"
                placeholder="Selecciona una opción"
                options={paymentCyclesList}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "paymentCycle", name, value)
                }
                value={
                  paymentCycleMap[formik.values.paymentCycle] ||
                  formik.values.paymentCycle
                }
                fullwidth
                disabled={true}
              />
              <Select
                label="Primer ciclo de pago"
                name="firstPaymentCycle"
                id="firstPaymentCycle"
                size="compact"
                placeholder="Selecciona una opción"
                options={firstPaymentCyclesList}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "firstPaymentCycle", name, value)
                }
                value={formik.values.firstPaymentCycle}
                fullwidth
                disabled={true}
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
                value={formik.values.termInMonths}
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
              />
              {showIncrementField && (
                <Textfield
                  label={
                    incrementType === "value"
                      ? "Valor de incremento"
                      : "Porcentaje de incremento"
                  }
                  name="incrementValue"
                  id="incrementValue"
                  placeholder={
                    incrementType === "value" ? "Ej: 50000" : "Ej: 5"
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
                    (isValidatingIncrement ? "Validando..." : "")
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

                    // Validar después de un pequeño delay (debounce)
                    const timeoutId = setTimeout(() => {
                      validateIncrementValue(value);
                    }, 500);

                    return () => clearTimeout(timeoutId);
                  }}
                  onBlur={() => validateIncrementValue(incrementValue)}
                  fullwidth
                />
              )}
              <Textfield
                label="Tasa de interés"
                name="interestRate"
                id="interestRate"
                placeholder="Ej: 0.9"
                value={formik.values.interestRate}
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
            </Stack>
          </ScrollableContainer>
        </BaseModal>
      )}
    </Formik>
  );
}

export { EditProductModal };
export type { EditProductModalProps };
