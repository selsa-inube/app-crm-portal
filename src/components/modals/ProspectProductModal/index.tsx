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
import { useState } from "react";

import { BaseModal } from "@components/modals/baseModal";
import { truncateTextToMaxLength } from "@utils/formatData/text";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";

import { ScrollableContainer } from "./styles";
import {
  creditLineOptions,
  paymentMethodOptions,
  paymentCycleOptions,
  firstPaymentCycleOptions,
  termInMonthsOptions,
  amortizationTypeOptions,
  rateTypeOptions,
} from "./config";

interface EditProductModalProps {
  onCloseModal: () => void;
  onConfirm: (values: FormikValues) => void;
  title: string;
  confirmButtonText: string;
  initialValues: FormikValues;
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
  } = props;

  const [modifiedGroup, setModifiedGroup] = useState<FieldGroup | null>(null);

  const isMobile = useMediaQuery("(max-width: 550px)");

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
  };

  const handleCurrencyChange = (
    formik: FormikProps<FormikValues>,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleFieldModification("creditAmount");
    handleChangeWithCurrency(formik, event);
  };

  const handleTextChange = (
    formik: FormikProps<FormikValues>,
    fieldName: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleFieldModification(fieldName);
    formik.handleChange(event);
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
          disabledNext={!formik.dirty || !formik.isValid}
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
                options={paymentMethodOptions}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "paymentMethod", name, value)
                }
                value={formik.values.paymentMethod}
                fullwidth
                disabled={isFieldDisabled("paymentMethod")}
              />
              <Select
                label="Ciclo de pagos"
                name="paymentCycle"
                id="paymentCycle"
                size="compact"
                placeholder="Selecciona una opción"
                options={paymentCycleOptions}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "paymentCycle", name, value)
                }
                value={formik.values.paymentCycle}
                fullwidth
                disabled={isFieldDisabled("paymentCycle")}
              />
              <Select
                label="Primer ciclo de pago"
                name="firstPaymentCycle"
                id="firstPaymentCycle"
                size="compact"
                placeholder="Selecciona una opción"
                options={firstPaymentCycleOptions}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "firstPaymentCycle", name, value)
                }
                value={formik.values.firstPaymentCycle}
                fullwidth
                disabled={isFieldDisabled("firstPaymentCycle")}
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
                disabled={isFieldDisabled("termInMonths")}
              />
              <Select
                label="Tipo de amortización"
                name="amortizationType"
                id="amortizationType"
                size="compact"
                placeholder="Selecciona una opción"
                options={amortizationTypeOptions}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "amortizationType", name, value)
                }
                value={formik.values.amortizationType}
                fullwidth
                disabled={isFieldDisabled("amortizationType")}
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
              />
              <Select
                label="Tipo de tasa"
                name="rateType"
                id="rateType"
                size="compact"
                placeholder="Selecciona una opción"
                options={rateTypeOptions}
                onBlur={formik.handleBlur}
                onChange={(name, value) =>
                  handleSelectChange(formik, "rateType", name, value)
                }
                value={formik.values.rateType}
                fullwidth
                disabled={isFieldDisabled("rateType")}
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
