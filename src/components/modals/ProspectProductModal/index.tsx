import { Formik, FormikValues, FormikHelpers } from "formik";
import * as Yup from "yup";
import { MdAttachMoney, MdOutlineInfo, MdPercent } from "react-icons/md";
import {
  Stack,
  Icon,
  useMediaQuery,
  Select,
  Textfield,
} from "@inubekit/inubekit";
import { useState } from "react";

import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import InfoModal from "@pages/prospect/components/InfoModal";
import { privilegeCrm } from "@config/privilege";
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

function EditProductModal(props: EditProductModalProps) {
  const {
    onCloseModal,
    onConfirm,
    title,
    confirmButtonText,
    initialValues,
    iconBefore,
    iconAfter,
  } = props;

  const isMobile = useMediaQuery("(max-width: 550px)");

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
  const { disabledButton: canEditCreditRequest } = useValidateUseCase({
    useCase: getUseCaseValue("canEditCreditRequest"),
  });
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
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
            !formik.dirty || !formik.isValid || canEditCreditRequest
          }
          iconBeforeNext={
            canEditCreditRequest ? (
              <Icon
                icon={<MdOutlineInfo />}
                appearance="primary"
                size="16px"
                cursorHover
                onClick={handleInfo}
              />
            ) : (
              iconBefore
            )
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
              <Select
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
              />
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
                onChange={(e) => handleChangeWithCurrency(formik, e)}
                fullwidth
              />
              <Select
                label="Medio de pago"
                name="paymentMethod"
                id="paymentMethod"
                size="compact"
                placeholder="Selecciona una opción"
                options={paymentMethodOptions}
                onBlur={formik.handleBlur}
                onChange={(name, value) => formik.setFieldValue(name, value)}
                value={formik.values.paymentMethod}
                fullwidth
              />
              <Select
                label="Ciclo de pagos"
                name="paymentCycle"
                id="paymentCycle"
                size="compact"
                placeholder="Selecciona una opción"
                options={paymentCycleOptions}
                onBlur={formik.handleBlur}
                onChange={(name, value) => formik.setFieldValue(name, value)}
                value={formik.values.paymentCycle}
                fullwidth
              />
              <Select
                label="Primer ciclo de pago"
                name="firstPaymentCycle"
                id="firstPaymentCycle"
                size="compact"
                placeholder="Selecciona una opción"
                options={firstPaymentCycleOptions}
                onBlur={formik.handleBlur}
                onChange={(name, value) => formik.setFieldValue(name, value)}
                value={formik.values.firstPaymentCycle}
                fullwidth
              />
              <Select
                label="Plazo en meses"
                name="termInMonths"
                id="termInMonths"
                size="compact"
                placeholder="Selecciona una opción"
                options={termInMonthsOptions}
                onBlur={formik.handleBlur}
                onChange={(name, value) => formik.setFieldValue(name, value)}
                value={formik.values.termInMonths}
                fullwidth
              />
              <Select
                label="Tipo de amortización"
                name="amortizationType"
                id="amortizationType"
                size="compact"
                placeholder="Selecciona una opción"
                options={amortizationTypeOptions}
                onBlur={formik.handleBlur}
                onChange={(name, value) => formik.setFieldValue(name, value)}
                value={formik.values.amortizationType}
                fullwidth
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
                onChange={formik.handleChange}
                fullwidth
              />
              <Select
                label="Tipo de tasa"
                name="rateType"
                id="rateType"
                size="compact"
                placeholder="Selecciona una opción"
                options={rateTypeOptions}
                onBlur={formik.handleBlur}
                onChange={(name, value) => formik.setFieldValue(name, value)}
                value={formik.values.rateType}
                fullwidth
              />
            </Stack>
          </ScrollableContainer>
          {isModalOpen ? (
            <InfoModal
              onClose={handleInfoModalClose}
              title={privilegeCrm.title}
              subtitle={privilegeCrm.subtitle}
              description={privilegeCrm.description}
              nextButtonText={privilegeCrm.nextButtonText}
              isMobile={isMobile}
            />
          ) : (
            <></>
          )}
        </BaseModal>
      )}
    </Formik>
  );
}

export { EditProductModal };
export type { EditProductModalProps };
