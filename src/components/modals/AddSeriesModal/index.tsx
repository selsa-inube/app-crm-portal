import * as Yup from "yup";
import { Formik, FormikValues } from "formik";
import { MdOutlineAttachMoney } from "react-icons/md";
import {
  Select,
  Stack,
  Textfield,
  inube,
  useMediaQuery,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import {
  frequencyOptionsMock,
  paymentDateOptionsMock,
  paymentMethodOptionsMock,
} from "@mocks/prospect/extraordinaryInstallment.mock";
import { handleFormSubmit } from "@utils/handleFormSubmit";

import { dataAddSeriesModal } from "./config";

export interface AddSeriesModalProps {
  handleClose: () => void;
  onSubmit: () => void;
  onConfirm: (values: FormikValues) => void;
  initialValues: FormikValues;
}

export function AddSeriesModal(props: AddSeriesModalProps) {
  const { handleClose, onSubmit, onConfirm, initialValues } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");

  const validationSchema = Yup.object({
    paymentMethod: Yup.string().required(""),
    amount: Yup.number().required(""),
    value: Yup.number().required(""),
    frequency: Yup.string().required(""),
    datePayment: Yup.date().required(""),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, formikHelpers) => {
        await handleFormSubmit(values, onConfirm);
        formikHelpers.setSubmitting(false);
        handleClose();
      }}
    >
      {(formik) => (
        <BaseModal
          title={dataAddSeriesModal.title}
          backButton={dataAddSeriesModal.cancel}
          nextButton={dataAddSeriesModal.add}
          handleBack={onSubmit}
          handleNext={formik.submitForm}
          handleClose={handleClose}
          disabledNext={!formik.dirty || !formik.isValid}
          width={isMobile ? "280px" : "425px"}
          height={isMobile ? "auto" : "639px"}
          finalDivider={true}
        >
          <Stack gap="24px" direction="column">
            <Select
              name="paymentMethod"
              id="paymentMethod"
              label={dataAddSeriesModal.labelPaymentMethod}
              placeholder={dataAddSeriesModal.placeHolderSelect}
              options={paymentMethodOptionsMock}
              value={formik.values.paymentMethod}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              onBlur={formik.handleBlur}
              size="wide"
              fullwidth
            />
            <Textfield
              name="amount"
              id="amount"
              label={dataAddSeriesModal.labelAmount}
              placeholder={dataAddSeriesModal.placeHolderAmount}
              onChange={(e) => handleChangeWithCurrency(formik, e)}
              value={validateCurrencyField("amount", formik, false, "")}
              onBlur={formik.handleBlur}
              size="wide"
              fullwidth
            />
            <Textfield
              name="value"
              id="value"
              label={dataAddSeriesModal.labelValue}
              placeholder={dataAddSeriesModal.placeHolderValue}
              iconBefore={
                <MdOutlineAttachMoney color={inube.palette.green.G400} />
              }
              onChange={(e) => handleChangeWithCurrency(formik, e)}
              value={validateCurrencyField("value", formik, false, "")}
              onBlur={formik.handleBlur}
              fullwidth
            />

            <Select
              name="frequency"
              id="frequency"
              label={dataAddSeriesModal.labelFrequency}
              placeholder={dataAddSeriesModal.placeHolderSelect}
              options={frequencyOptionsMock}
              value={formik.values.frequency}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              onBlur={formik.handleBlur}
              size="wide"
              fullwidth
            />
            <Select
              name="datePayment"
              id="datePayment"
              label={dataAddSeriesModal.labelDate}
              placeholder={dataAddSeriesModal.placeHolderSelect}
              options={paymentDateOptionsMock}
              value={formik.values.datePayment}
              onChange={(name, value) => formik.setFieldValue(name, value)}
              onBlur={formik.handleBlur}
              size="wide"
              fullwidth
            />
          </Stack>
        </BaseModal>
      )}
    </Formik>
  );
}
