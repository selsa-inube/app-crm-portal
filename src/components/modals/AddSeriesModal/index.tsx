import * as Yup from "yup";
import localforage from "localforage";
import { Formik, FormikValues } from "formik";
import { MdOutlineAttachMoney } from "react-icons/md";
import { Textfield } from "@inubekit/textfield";
import { Select } from "@inubekit/select";
import { Stack, inube, useMediaQuery } from "@inubekit/inubekit";
import { Datefield } from "@inubekit/datefield";

import { BaseModal } from "@components/modals/baseModal";
import { TableExtraordinaryInstallmentProps } from "@pages/prospect/components/TableExtraordinaryInstallment";
import {
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import {
  frequencyOptionsMock,
  paymentMethodOptionsMock,
} from "@mocks/prospect/extraordinaryInstallment.mock";

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

  const handleFormSubmit = async (values: FormikValues) => {
    const storedData =
      (await localforage.getItem<TableExtraordinaryInstallmentProps[]>(
        "extraordinary_installments",
      )) || [];

    const updatedValues = {
      ...values,
    };

    if (values.id) {
      const updatedData = storedData.map((item) =>
        item.id === values.id ? { ...item, ...updatedValues } : item,
      );
      await localforage.setItem("extraordinary_installments", updatedData);
    } else {
      const newItem = {
        ...updatedValues,
        id: Date.now(),
      };
      await localforage.setItem("extraordinary_installments", [
        ...storedData,
        newItem,
      ]);
    }
    onConfirm(updatedValues);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, formikHelpers) => {
        await handleFormSubmit(values);
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
            <Datefield
              name="datePayment"
              id="datePayment"
              label={dataAddSeriesModal.labelDate}
              value={formik.values.datePayment}
              onChange={(e) =>
                formik.setFieldValue("datePayment", e.target.value)
              }
              onBlur={formik.handleBlur}
              fullwidth
            />
          </Stack>
        </BaseModal>
      )}
    </Formik>
  );
}
