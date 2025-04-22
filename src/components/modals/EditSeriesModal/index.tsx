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
import { paymentMethodOptionsMock } from "@mocks/prospect/extraordinaryInstallment.mock";

import { dataEditSeriesModal } from "./config";

export interface EditSeriesModalProps {
  handleClose: () => void;
  onSubmit: () => void;
  onConfirm: (values: FormikValues) => void;
  initialValues: FormikValues;
}

export function EditSeriesModal(props: EditSeriesModalProps) {
  const { onConfirm, handleClose, onSubmit, initialValues } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");

  const validationSchema = Yup.object({
    paymentMethod: Yup.string().required(""),
    value: Yup.number().required(""),
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
          title={dataEditSeriesModal.title}
          nextButton={dataEditSeriesModal.add}
          handleNext={formik.submitForm}
          backButton={dataEditSeriesModal.cancel}
          handleBack={onSubmit}
          handleClose={handleClose}
          finalDivider={true}
          disabledNext={!formik.dirty || !formik.isValid}
          width={isMobile ? "280px" : "425px"}
        >
          <Stack gap="24px" direction="column">
            <Datefield
              name="datePayment"
              id="datePayment"
              label={dataEditSeriesModal.labelDate}
              value={formik.values.datePayment}
              onChange={(e) =>
                formik.setFieldValue("datePayment", e.target.value)
              }
              onBlur={formik.handleBlur}
              fullwidth
            />
            <Textfield
              name="value"
              id="value"
              label={dataEditSeriesModal.labelValue}
              placeholder={dataEditSeriesModal.placeHolderValue}
              iconBefore={
                <MdOutlineAttachMoney color={inube.palette.green.G400} />
              }
              onChange={(e) => handleChangeWithCurrency(formik, e)}
              value={validateCurrencyField("value", formik, false, "")}
              onBlur={formik.handleBlur}
              fullwidth
            />
            <Select
              name="paymentMethod"
              id="paymentMethod"
              label={dataEditSeriesModal.labelPaymentMethod}
              placeholder={dataEditSeriesModal.placeHolderSelect}
              options={paymentMethodOptionsMock}
              value={formik.values.paymentMethod}
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
