import { Form, Formik } from "formik";
import { useContext, useEffect } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import {
  Select,
  Stack,
  Textfield,
  inube,
  useFlag,
  useMediaQuery,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import {
  handleChangeWithCurrency,
  parseCurrencyString,
  validateCurrencyField,
} from "@utils/formatData/currency";
import {
  frequencyOptionsMock,
  paymentDateOptionsMock,
  paymentMethodOptionsMock,
} from "@mocks/prospect/extraordinaryInstallment.mock";
import { AppContext } from "@context/AppContext";
import {
  IExtraordinaryInstallment,
  IExtraordinaryInstallments,
} from "@services/iProspect/saveExtraordinaryInstallments/types";

import { dataAddSeriesModal } from "./config";
import { saveExtraordinaryInstallment } from "../ExtraordinaryPaymentModal/utils";
import { TextLabels } from "../ExtraordinaryPaymentModal/config";

export interface AddSeriesModalProps {
  handleClose: () => void;
  onSubmit: (values: {
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
  }) => void;

  installmentState?: {
    installmentAmount: number;
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
  };

  seriesModal?: IExtraordinaryInstallment[];
  setAddModal?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallment | null>
  >;

  setSeriesModal?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallment[]>
  >;
  setSentData?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallments | null>
  >;
  setInstallmentState?: React.Dispatch<
    React.SetStateAction<{
      installmentAmount: number;
      installmentDate: string;
      paymentChannelAbbreviatedName: string;
    }>
  >;

  sentData?: IExtraordinaryInstallments | null;
  selectedModal?: IExtraordinaryInstallment | null;
}

export function AddSeriesModal(props: AddSeriesModalProps) {
  const {
    handleClose,
    onSubmit,
    seriesModal,
    setSentData,
    setAddModal,
    installmentState,
    setInstallmentState,
  } = props;
  const { businessUnitSigla } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const { addFlag } = useFlag();

  const isMobile = useMediaQuery("(max-width: 700px)");

  const handleGenericSelectChange = (
    name: string,
    value: string,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    setFieldValue(name, value);

    if (name === "installmentDate") {
      const parsedDate = new Date(value);
      const isoDate = !isNaN(parsedDate.getTime())
        ? parsedDate.toISOString()
        : "";

      const selected = seriesModal?.find(
        (seriesModals) => seriesModals.installmentDate === value,
      );

      if (selected && setAddModal && setInstallmentState) {
        setAddModal(selected);
        setInstallmentState((prev) => ({
          ...prev,
          installmentDate: isoDate || selected.installmentDate,
        }));
      } else if (setInstallmentState) {
        setInstallmentState((prev) => ({
          ...prev,
          installmentDate: isoDate,
        }));
      }
    }

    if (name === "paymentChannelAbbreviatedName" && setInstallmentState) {
      setInstallmentState((prev) => ({
        ...prev,
        paymentChannelAbbreviatedName: value,
      }));
    }
  };

  const handleInstallmentAmountChange = (
    name: string,
    value: string,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    setFieldValue(name, value);
    const parsedValue = parseCurrencyString(value);
    if (!isNaN(parsedValue) && setInstallmentState) {
      setInstallmentState((prev) => ({
        ...prev,
        installmentAmount: parsedValue,
      }));
    }
  };
  const initialValues: IExtraordinaryInstallments = {
    creditProductCode: "SC-000000038-1",
    extraordinaryInstallments: [
      {
        installmentAmount: 2500,
        installmentDate: "",
        paymentChannelAbbreviatedName: "ullamco quis velit",
      },
    ],
    prospectId: "67f7e8f52c014414fca8b52d",
  };
  const handleExtraordinaryInstallment = async (
    extraordinaryInstallments: IExtraordinaryInstallments,
  ) => {
    await saveExtraordinaryInstallment(
      businessUnitPublicCode,
      extraordinaryInstallments,
    )
      .then(() => {
        addFlag({
          title: TextLabels.titleSuccess,
          description: TextLabels.descriptionSuccess,
          appearance: "success",
          duration: 5000,
        });
        setSentData?.(extraordinaryInstallments);
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

  const handleNextClick = () => {
    if (!installmentState || !setSentData) return;

    const {
      installmentAmount,
      installmentDate,
      paymentChannelAbbreviatedName,
    } = installmentState;

    if (
      !installmentAmount ||
      !installmentDate ||
      !paymentChannelAbbreviatedName
    ) {
      return;
    }

    const updatedValues: IExtraordinaryInstallments = {
      ...initialValues,
      extraordinaryInstallments: [
        {
          ...initialValues.extraordinaryInstallments[0],
          installmentDate,
          installmentAmount,
          paymentChannelAbbreviatedName,
        },
      ],
    };

    handleExtraordinaryInstallment(updatedValues);
  };

  useEffect(() => {
    if (setInstallmentState) {
      setInstallmentState({
        installmentAmount: 0,
        installmentDate: "",
        paymentChannelAbbreviatedName: "",
      });
    }
  }, []);

  return (
    <Formik
      initialValues={{
        installmentDate: "",
        paymentChannelAbbreviatedName: "",
        value: "",
        frequency: "",
      }}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit?.(values);
        setSubmitting(false);
      }}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <BaseModal
            title={dataAddSeriesModal.title}
            backButton={dataAddSeriesModal.cancel}
            nextButton={dataAddSeriesModal.add}
            handleBack={handleClose}
            handleNext={handleNextClick}
            handleClose={handleClose}
            width={isMobile ? "280px" : "425px"}
            height={isMobile ? "auto" : "639px"}
            finalDivider={true}
            disabledNext={
              !installmentState?.paymentChannelAbbreviatedName ||
              !installmentState?.installmentAmount ||
              !installmentState?.installmentDate
            }
          >
            <Stack gap="24px" direction="column">
              <Select
                name="paymentChannelAbbreviatedName"
                id="paymentChannelAbbreviatedName"
                label={dataAddSeriesModal.labelPaymentMethod}
                placeholder={dataAddSeriesModal.placeHolderSelect}
                options={paymentMethodOptionsMock}
                value={values.paymentChannelAbbreviatedName}
                onChange={(name, value) =>
                  handleGenericSelectChange(name, value, setFieldValue)
                }
                size="wide"
                fullwidth
                required
              />

              <Textfield
                name="value"
                id="value"
                label={dataAddSeriesModal.labelAmount}
                placeholder={dataAddSeriesModal.placeHolderAmount}
                onChange={(e) => {
                  handleChangeWithCurrency({ setFieldValue }, e);
                }}
                value={values.value}
                size="wide"
                fullwidth
              />
              <Textfield
                name="installmentAmount"
                id="installmentAmount"
                label={dataAddSeriesModal.labelValue}
                placeholder={dataAddSeriesModal.placeHolderValue}
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
                required
                fullwidth
              />
              <Select
                name="frequency"
                id="frequency"
                label={dataAddSeriesModal.labelFrequency}
                placeholder={dataAddSeriesModal.placeHolderSelect}
                options={frequencyOptionsMock}
                value={values.frequency}
                onChange={(name, value) => setFieldValue(name, value)}
                size="wide"
                fullwidth
              />

              <Select
                name="installmentDate"
                id="installmentDate"
                label={dataAddSeriesModal.labelDate}
                placeholder={dataAddSeriesModal.placeHolderSelect}
                options={paymentDateOptionsMock}
                value={values.installmentDate}
                onChange={(name, value) =>
                  handleGenericSelectChange(name, value, setFieldValue)
                }
                size="wide"
                required
                fullwidth
              />
            </Stack>
          </BaseModal>
        </Form>
      )}
    </Formik>
  );
}
