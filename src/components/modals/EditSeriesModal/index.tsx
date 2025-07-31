import { FormikValues, useFormik } from "formik";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useState } from "react";
import {
  Select,
  Stack,
  Textfield,
  inube,
  useMediaQuery,
  Date,
} from "@inubekit/inubekit";

import { paymentMethodOptionsMock } from "@mocks/prospect/extraordinaryInstallment.mock";
import { TableExtraordinaryInstallmentProps } from "@pages/prospect/components/TableExtraordinaryInstallment";
import {
  IExtraordinaryInstallments,
  IProspect,
} from "@services/prospect/types";
import { BaseModal } from "@components/modals/baseModal";
import { handleFormSubmit } from "@utils/handleFormSubmit";
import {
  parseCurrencyString,
  validateCurrencyField,
} from "@utils/formatData/currency";

import { dataEditSeriesModal } from "./config";

export interface EditSeriesModalProps {
  handleClose: () => void;
  onSubmit: () => void;
  onConfirm: (values: FormikValues) => void;
  prospectData: IProspect | undefined;
  selectedDebtor: TableExtraordinaryInstallmentProps;
  setSentData?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallments | null>
  >;
  businessUnitPublicCode: string;
  service?: boolean;
}

export function EditSeriesModal(props: EditSeriesModalProps) {
  const {
    onConfirm,
    handleClose,
    onSubmit,
    selectedDebtor,
    service = true,
  } = props;

  const isMobile = useMediaQuery("(max-width: 700px)");

  const getInitialValues = (
    selectedDebtor: TableExtraordinaryInstallmentProps,
  ) => ({
    installmentAmount: selectedDebtor?.value || 0,
    paymentChannelAbbreviatedName: selectedDebtor?.paymentMethod || "",
    installmentDate: selectedDebtor?.datePayment || "",
  });

  const [installmentState, setInstallmentState] = useState(
    getInitialValues(selectedDebtor),
  );

  const formik = useFormik({
    initialValues: installmentState,
    onSubmit: async (values) => {
      await handleFormSubmit(values, onConfirm);
      handleClose();
    },
  });

  const handleExtraordinaryInstallment = async () => {
    if (!service) {
      await handleFormSubmit(formik.values, onConfirm);
      handleClose();
      return;
    }
  };

  return (
    <BaseModal
      title={dataEditSeriesModal.title}
      nextButton={dataEditSeriesModal.add}
      handleNext={handleExtraordinaryInstallment}
      backButton={dataEditSeriesModal.cancel}
      handleBack={onSubmit}
      handleClose={handleClose}
      finalDivider
      disabledNext={!formik.dirty || !formik.values.installmentAmount}
      width={isMobile ? "280px" : "425px"}
    >
      <Stack gap="24px" direction="column">
        <Date
          name="installmentDate"
          id="installmentDate"
          label={dataEditSeriesModal.labelDate}
          value={
            typeof formik.values.installmentDate === "string"
              ? formik.values.installmentDate.split("T")[0]
              : formik.values.installmentDate.toString().split("T")[0]
          }
          onChange={(e) => {
            const dateValue = e.target.value;
            formik.setFieldValue("installmentDate", dateValue);
            setInstallmentState((prev) => ({
              ...prev,
              installmentDate: dateValue,
            }));
          }}
          fullwidth
          disabled
        />

        <Textfield
          name="installmentAmount"
          id="installmentAmount"
          label={dataEditSeriesModal.labelValue}
          placeholder={dataEditSeriesModal.placeHolderValue}
          iconBefore={<MdOutlineAttachMoney color={inube.palette.green.G400} />}
          onChange={(e) => {
            const value = e.target.value;
            formik.setFieldValue("installmentAmount", value);
            const parsed = parseCurrencyString(value);
            if (!isNaN(parsed)) {
              setInstallmentState((prev) => ({
                ...prev,
                installmentAmount: parsed,
              }));
            }
          }}
          value={validateCurrencyField("installmentAmount", formik, false, "")}
          fullwidth
          required
        />

        <Select
          name="paymentChannelAbbreviatedName"
          id="paymentChannelAbbreviatedName"
          label={dataEditSeriesModal.labelPaymentMethod}
          placeholder={dataEditSeriesModal.placeHolderSelect}
          options={paymentMethodOptionsMock}
          value={validateCurrencyField(
            "paymentChannelAbbreviatedName",
            formik,
            false,
            "",
          )}
          onChange={(name, value) => {
            formik.setFieldValue(name, value);
            setInstallmentState((prev) => ({
              ...prev,
              [name]: value,
            }));
          }}
          size="wide"
          fullwidth
          disabled
        />
      </Stack>
    </BaseModal>
  );
}
