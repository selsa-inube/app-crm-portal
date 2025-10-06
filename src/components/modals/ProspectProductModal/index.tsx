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
import { useState, useEffect } from "react";

import { BaseModal } from "@components/modals/baseModal";
import { truncateTextToMaxLength } from "@utils/formatData/text";
import { postBusinessUnitRules } from "@services/businessUnitRules/EvaluteRuleByBusinessUnit";
import { getPaymentMethods } from "@services/prospect/getPaymentMethods";
import {
  IPaymentMethod,
  IPaymentCycle,
  IFirstPaymentCycle
} from "@services/prospect/getPaymentMethods/types";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";

import { ScrollableContainer } from "./styles";
import {
  termInMonthsOptions,
  amortizationTypeOptions,
  rateTypeOptions,
  VALIDATED_NUMBER_REGEX,
  messagesErrorValidations
} from "./config";

interface EditProductModalProps {
  onCloseModal: () => void;
  onConfirm: (values: FormikValues) => void;
  title: string;
  confirmButtonText: string;
  initialValues: FormikValues;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
}

type FieldGroup =
  | "creditAmount"
  | "paymentGroup"
  | "termInMonths"
  | "amortizationType"
  | "interestRate"
  | "rateType";

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
  } = props;

  const [modifiedGroup, setModifiedGroup] = useState<FieldGroup | null>(null);
  const [loanAmountError, setLoanAmountError] = useState<string>("");
  const [paymentMethodsList, setPaymentMethodsList] = useState<IPaymentMethod[]>([]);
  const [paymentCyclesList, setPaymentCyclesList] = useState<IPaymentCycle[]>([]);
  const [firstPaymentCyclesList, setFirstPaymentCyclesList] = useState<IFirstPaymentCycle[]>([]);
  const [isLoadingPaymentOptions, setIsLoadingPaymentOptions] = useState(false);
  const [paymentOptionsError, setPaymentOptionsError] = useState<string>("");
  const [loanTermError, setLoanTermError] = useState<string>("");
  const [amortizationTypesList, setAmortizationTypesList] = useState<{ id: string; value: string; label: string }[]>([]);
  const [isLoadingAmortizationTypes, setIsLoadingAmortizationTypes] = useState(false);
  const [interestRateError, setInterestRateError] = useState<string>("");
  const [rateTypesList, setRateTypesList] = useState<{ id: string; value: string; label: string }[]>([]);
  const [isLoadingRateTypes, setIsLoadingRateTypes] = useState(false);

  const isMobile = useMediaQuery("(max-width: 550px)");

  // ← NUEVO: Cargar opciones de pago al montar el componente
  useEffect(() => {
    const loadPaymentOptions = async () => {
      setIsLoadingPaymentOptions(true);
      setPaymentOptionsError("");

      try {
        const response = await getPaymentMethods(
          businessUnitPublicCode,
          businessManagerCode,
          initialValues.creditLine, // OPTINAL IN CASE OF OTHERS VALIDATIONS
        );

        if (!response) {
          throw new Error(messagesErrorValidations.loadPaymentOptions);
        }

        setPaymentMethodsList(response.paymentMethods);
        setPaymentCyclesList(response.paymentCycles);
        setFirstPaymentCyclesList(response.firstPaymentCycles);
      } catch (error) {
        setPaymentOptionsError(messagesErrorValidations.loadPaymentOptions);

        // ← Fallback a opciones estáticas si falla
        setPaymentMethodsList(
          [{
            id: "0",
            value: "No hay opciones de pago disponibles",
            label: "No hay opciones de pago disponibles",
          }]
        );

        setPaymentCyclesList(
          [{
            id: "0",
            value: "No hay opciones de pago disponibles",
            label: "No hay opciones de pago disponibles",
          }]
        );

        setFirstPaymentCyclesList(
          [{
            id: "0",
            value: "No hay opciones de pago disponibles",
            label: "No hay opciones de pago disponibles",
          }]
        );
        // ... mismo para los otros dos
      } finally {
        setIsLoadingPaymentOptions(false);
      }
    };

    loadPaymentOptions();
  }, [businessUnitPublicCode, businessManagerCode, initialValues.creditLine]);

  // ← NUEVO: Cargar tipos de amortización desde regla RepaymentStructure
  useEffect(() => {
    const loadAmortizationTypes = async () => {
      setIsLoadingAmortizationTypes(true);

      try {
        const payload = {
          ruleName: "RepaymentStructure",
          conditions: [],
        };

        const response = await postBusinessUnitRules(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
        );

        // Mapear decisiones a opciones del select
        if (response && Array.isArray(response) && response.length > 0) {
          const options = response.map((decision, index) => ({
            id: decision.decisionId || `${index}`,
            value: decision.value || "",
            label: decision.typeDecision || decision.value || "",
          }));
          setAmortizationTypesList(options);
        } else {
          // Fallback a opciones estáticas
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
  }, [businessUnitPublicCode, businessManagerCode]);

  // ← NUEVO: Cargar tipos de tasa desde regla InterestRateType
  useEffect(() => {
    const loadRateTypes = async () => {
      setIsLoadingRateTypes(true);

      try {
        const payload = {
          ruleName: "InterestRateType",
          conditions: [],
        };

        const response = await postBusinessUnitRules(
          businessUnitPublicCode,
          businessManagerCode,
          payload,
        );

        // Mapear decisiones a opciones del select
        if (response && Array.isArray(response) && response.length > 0) {
          const options = response.map((decision, index) => ({
            id: decision.decisionId || `${index}`,
            value: decision.value || "",
            label: decision.typeDecision || decision.value || "",
          }));
          setRateTypesList(options);
        } else {
          // Fallback a opciones estáticas
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
  }, [businessUnitPublicCode, businessManagerCode]);

  const getFieldGroup = (fieldName: string): FieldGroup | null => {
    if (fieldName === "creditAmount") return "creditAmount";

    if (
      ["paymentMethod", "paymentCycle", "firstPaymentCycle"].includes(fieldName)
    ) {
      return "paymentGroup";
    }

    if (fieldName === "termInMonths") return "termInMonths";
    if (fieldName === "amortizationType") return "amortizationType";
    if (fieldName === "interestRate") return "interestRate";
    if (fieldName === "rateType") return "rateType";
    return null;
  };

  const isFieldDisabled = (fieldName: string): boolean => {
    if (!modifiedGroup) return false;

    const fieldGroup = getFieldGroup(fieldName);

    return fieldGroup !== modifiedGroup;
  };

  const handleFieldModification = (fieldName: string) => {
    if (!modifiedGroup) {
      const group = getFieldGroup(fieldName);
      if (group) {
        setModifiedGroup(group);
      }
    }
  };

  const handleSelectChange = (
    formik: FormikProps<FormikValues>,
    fieldName: string,
    name: string,
    value: string,
  ) => {
    handleFieldModification(fieldName);
    formik.setFieldValue(name, value);

    if (fieldName === "termInMonths" && value) {
      const numericValue = Number(value);
      if (numericValue > 0) {
        validateLoanTerm(numericValue);
      } else {
        setLoanTermError("");
      }
    }
  };

  const handleTextChange = (
    formik: FormikProps<FormikValues>,
    fieldName: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleFieldModification(fieldName);
    formik.handleChange(event);

    if (fieldName === "interestRate") {
      const numericValue = Number(event.target.value);
      if (numericValue > 0) {
        validateInterestRate(numericValue);
      } else {
        setInterestRateError("");
      }
    }
  };

  const validateLoanAmount = async (amount: number): Promise<void> => {
    try {
      setLoanAmountError("");

      const payload = {
        ruleName: "loanAmount",
        conditions: [
          {
            condition: "loanAmount",
            value: amount.toString(),
          },
        ],
      };

      const response = await postBusinessUnitRules(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
      );

      // LO QUE TOQUE VALIDAR EL MONTO DEL CREDITO
    } catch (error) {
      setLoanAmountError(messagesErrorValidations.validateLoanAmount);
    }
  };

  // ← NUEVO: Valida el plazo usando la regla loanTerm
  const validateLoanTerm = async (term: number): Promise<void> => {
    try {
      setLoanTermError("");

      const payload = {
        ruleName: "loanTerm",
        conditions: [
          {
            condition: "loanTerm",
            value: term.toString(),
          },
        ],
      };

      const response = await postBusinessUnitRules(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
      );

      if (!response || !Array.isArray(response) || response.length === 0) {
        setLoanTermError(messagesErrorValidations.validateLoanTermBusiness);
        return;
      }

      const hasValidDecision = response.some((decision) => {
        return decision.value !== undefined && decision.value !== null;
      });

      if (!hasValidDecision) {
        setLoanTermError(messagesErrorValidations.validateLoanTermRange);
      }
    } catch (error) {
      console.error("Error validando plazo:", error);
      setLoanTermError(messagesErrorValidations.validateLoanTermOther);
    }
  };
  // ← NUEVO: Valida la tasa de interés usando la regla interestRate
  const validateInterestRate = async (rate: number): Promise<void> => {
    try {
      setInterestRateError("");

      const payload = {
        ruleName: "interestRate",
        conditions: [
          {
            condition: "interestRate",
            value: rate.toString(),
          },
        ],
      };

      const response = await postBusinessUnitRules(
        businessUnitPublicCode,
        businessManagerCode,
        payload,
      );

      if (!response || !Array.isArray(response) || response.length === 0) {
        setInterestRateError(messagesErrorValidations.validateInterestRateBusiness);
        return;
      }

      const hasValidDecision = response.some((decision) => {
        return decision.value !== undefined && decision.value !== null;
      });

      if (!hasValidDecision) {
        setInterestRateError(messagesErrorValidations.validateInterestRateRange);
      }
    } catch (error) {
      console.error("Error validando tasa de interés:", error);
      setInterestRateError(messagesErrorValidations.validateInterestRateOther);
    }
  };

  const handleCurrencyChange = (
    formik: FormikProps<FormikValues>,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleFieldModification("creditAmount");
    handleChangeWithCurrency(formik, event);

    const rawValue = event.target.value.replace(VALIDATED_NUMBER_REGEX, "");
    const numericValue = Number(rawValue);

    if (numericValue > 0) {
      validateLoanAmount(numericValue);
    } else {
      setLoanAmountError("");
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
            !!interestRateError
          }
          iconAfterNext={iconAfter}
          finalDivider={true}
        >
          <ScrollableContainer $smallScreen={isMobile}>
            <Stack
              direction="column"
              gap="24px"
              width="100%"
              height={isMobile ? "auto" : "600px"}
            >
              {/*               <Select
                label="Línea de crédito"
                name="creditLine"
                id="creditLine"
                size="compact"
                placeholder="Selecciona una opción"
                options={creditLineOptions}
                onBlur={formik.handleBlur}
                onChange={(name, value) => formik.setFieldValue(name, value)}
                value={formik.values.creditLine}
                fullwidth
              /> */}
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
                disabled={isFieldDisabled("creditAmount")}
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
                value={formik.values.paymentMethod}
                fullwidth
                disabled={isFieldDisabled("paymentMethod") || isLoadingPaymentOptions}
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
                value={formik.values.paymentCycle}
                fullwidth
                disabled={isFieldDisabled("paymentCycle") || isLoadingPaymentOptions}
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
                disabled={isFieldDisabled("firstPaymentCycle") || isLoadingPaymentOptions}
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
                disabled={isFieldDisabled("termInMonths")}
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
                  handleSelectChange(formik, "amortizationType", name, value)
                }
                value={formik.values.amortizationType}
                fullwidth
                disabled={isFieldDisabled("amortizationType") || isLoadingAmortizationTypes}
              />
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
                disabled={isFieldDisabled("interestRate")}
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
                value={formik.values.rateType}
                fullwidth
                disabled={isFieldDisabled("rateType") || isLoadingRateTypes}
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
