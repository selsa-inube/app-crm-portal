import { Form, Formik, FormikValues } from "formik";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useContext, useState } from "react";
import {
  Select,
  Stack,
  Textfield,
  inube,
  useMediaQuery,
  Date,
  useFlag,
} from "@inubekit/inubekit";

import { AppContext } from "@context/AppContext";
import { updateExtraordinaryInstallment } from "@pages/prospect/components/TableExtraordinaryInstallment/utils";
import { IProspect } from "@services/prospects/types";
import { paymentMethodOptionsMock } from "@mocks/prospect/extraordinaryInstallment.mock";
import { TableExtraordinaryInstallmentProps } from "@pages/prospect/components/TableExtraordinaryInstallment";
import { IExtraordinaryInstallments } from "@services/iProspect/updateExtraordinaryInstallments/types";
import { BaseModal } from "@components/modals/baseModal";
import { handleFormSubmit } from "@utils/handleFormSubmit";
import {
  parseCurrencyString,
  validateCurrencyField,
} from "@utils/formatData/currency";

import { dataEditSeriesModal } from "./config";
import { TextLabels } from "../ExtraordinaryPaymentModal/config";

export interface EditSeriesModalProps {
  handleClose: () => void;
  onSubmit: () => void;
  onConfirm: (values: FormikValues) => void;
  prospectData: IProspect | undefined;
  selectedDebtor: TableExtraordinaryInstallmentProps;
  setSentData:
    | React.Dispatch<React.SetStateAction<IExtraordinaryInstallments | null>>
    | undefined;
}

export function EditSeriesModal(props: EditSeriesModalProps) {
  const { onConfirm, handleClose, onSubmit, selectedDebtor, setSentData } =
    props;

  const isMobile = useMediaQuery("(max-width: 700px)");

  const { businessUnitSigla } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const { addFlag } = useFlag();
  const handleExtraordinaryInstallment = async (
    extraordinaryInstallments: IExtraordinaryInstallments,
  ) => {
    const { installmentAmount, paymentChannelAbbreviatedName } =
      installmentState;

    extraordinaryInstallments.extraordinaryInstallments[0] = {
      installmentAmount: parseCurrencyString(installmentAmount.toString()),
      installmentDate: installmentState.installmentDate.toString(),
      paymentChannelAbbreviatedName: paymentChannelAbbreviatedName.toString(),
    };

    await updateExtraordinaryInstallment(
      businessUnitPublicCode,
      extraordinaryInstallments,
    )
      .then(() => {
        addFlag({
          title: dataEditSeriesModal.titleSuccess,
          description: dataEditSeriesModal.descriptionSuccess,
          appearance: "success",
          duration: 5000,
        });
        if (setSentData) {
          setSentData(extraordinaryInstallments);
        }
        handleClose();
      })
      .catch(() => {
        addFlag({
          title: TextLabels.titleError,
          description: TextLabels.descriptionError,
          appearance: "danger",
          duration: 5000,
        });
      });
  };

  const getInitialValues = (
    selectedDebtor: TableExtraordinaryInstallmentProps,
  ) => ({
    installmentAmount: selectedDebtor?.value || 0,
    paymentChannelAbbreviatedName: selectedDebtor?.paymentMethod || "",
    installmentDate: selectedDebtor?.datePayment || "",
  });

  const handleInstallmentAmountChange = (
    name: string,
    value: string,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    setFieldValue(name, value);
    const parsedValue = parseCurrencyString(value);
    if (!isNaN(parsedValue)) {
      setInstallmentState((prev) => {
        const newState = {
          ...prev,
          [name]: parsedValue,
        };

        return newState;
      });
    }
  };

  const handlePaymentChannelChange = (
    name: string,
    value: string,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    setFieldValue(name, value);
    setInstallmentState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [installmentState, setInstallmentState] = useState(
    getInitialValues(selectedDebtor),
  );
  const initialValues: IExtraordinaryInstallments = {
    creditProductCode: "SC-000000038-1",
    extraordinaryInstallments: [
      {
        installmentAmount: 0,
        installmentDate: "",
        paymentChannelAbbreviatedName: "",
      },
    ],
    prospectId: "67f7e8f52c014414fca8b52d",
  };

  return (
    <Formik
      initialValues={installmentState}
      onSubmit={async (values, formikHelpers) => {
        await handleFormSubmit(values, onConfirm);
        formikHelpers.setSubmitting(false);
        handleClose();
      }}
    >
      {({ setFieldValue, values, dirty }) => (
        <Form>
          <BaseModal
            title={dataEditSeriesModal.title}
            nextButton={dataEditSeriesModal.add}
            handleNext={() => handleExtraordinaryInstallment(initialValues)}
            backButton={dataEditSeriesModal.cancel}
            handleBack={onSubmit}
            handleClose={handleClose}
            finalDivider={true}
            disabledNext={!dirty || !values.installmentAmount}
            width={isMobile ? "280px" : "425px"}
          >
            <Stack gap="24px" direction="column">
              <Date
                name="installmentDate"
                id="installmentDate"
                label={dataEditSeriesModal.labelDate}
                value={
                  typeof values.installmentDate === "string"
                    ? values.installmentDate.split("T")[0]
                    : values.installmentDate.toString().split("T")[0]
                }
                onChange={(e) => {
                  const dateValue = e.target.value;
                  setFieldValue("installmentDate", dateValue);
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
                iconBefore={
                  <MdOutlineAttachMoney color={inube.palette.green.G400} />
                }
                onChange={(e) =>
                  handleInstallmentAmountChange(
                    "installmentAmount",
                    e.target.value,
                    setFieldValue,
                  )
                }
                value={validateCurrencyField(
                  "installmentAmount",
                  { values },
                  false,
                  "",
                )}
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
                  { values },
                  false,
                  "",
                )}
                onChange={(name, value) =>
                  handlePaymentChannelChange(name, value, setFieldValue)
                }
                size="wide"
                fullwidth
                disabled
              />
            </Stack>
          </BaseModal>
        </Form>
      )}
    </Formik>
  );
}
