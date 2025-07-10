import { useFormik } from "formik";
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
  currencyFormat,
  handleChangeWithCurrency,
  parseCurrencyString,
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
import { IProspect } from "@services/prospects/types";

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
  prospectData?: IProspect;
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
    prospectData,
  } = props;

  const { businessUnitSigla } = useContext(AppContext);
  const { addFlag } = useFlag();
  const isMobile = useMediaQuery("(max-width: 700px)");

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const formik = useFormik({
    initialValues: {
      installmentDate: "",
      installmentAmount: 0,
      paymentChannelAbbreviatedName: "",
      value: "",
      frequency: "",
    },
    onSubmit: (values) => {
      onSubmit?.(values);
    },
  });

  const handleGenericSelectChange = (name: string, value: string) => {
    formik.setFieldValue(name, value);

    if (name === "installmentDate") {
      const parsedDate = new Date(value);
      const isoDate = !isNaN(parsedDate.getTime())
        ? parsedDate.toISOString()
        : "";

      const selected = seriesModal?.find((s) => s.installmentDate === value);

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

  const handleInstallmentAmountChange = (name: string, value: string) => {
    const parsed = parseCurrencyString(value);
    formik.setFieldValue(name, currencyFormat(parsed, false));
    if (!isNaN(parsed) && setInstallmentState) {
      setInstallmentState((prev) => ({
        ...prev,
        installmentAmount: parsed,
      }));
    }
  };

  const initialValues: IExtraordinaryInstallments = {
    creditProductCode:
      prospectData?.creditProducts?.[0]?.creditProductCode || "",
    extraordinaryInstallments: [
      {
        installmentAmount: 0,
        installmentDate: "",
        paymentChannelAbbreviatedName: "",
      },
    ],
    prospectId: prospectData?.prospectId || "",
  };

  const handleExtraordinaryInstallment = async (
    extraordinaryInstallments: IExtraordinaryInstallments,
  ) => {
    try {
      await saveExtraordinaryInstallment(
        businessUnitPublicCode,
        extraordinaryInstallments,
      );

      setSentData?.(extraordinaryInstallments);
      handleClose();
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        status?: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description =
        code + (err?.message || "") + (err?.data?.description || "");

      addFlag({
        title: TextLabels.titleError,
        description,
        appearance: "danger",
        duration: 5000,
      });
    }
  };

  const handleNextClick = () => {
    if (!installmentState || !setSentData) return;

    const {
      installmentAmount,
      installmentDate,
      paymentChannelAbbreviatedName,
    } = installmentState;

    const count = parseInt(formik.values.value, 10);
    const frequency = formik.values.frequency;
    if (
      !installmentAmount ||
      !installmentDate ||
      !paymentChannelAbbreviatedName ||
      isNaN(count) ||
      count < 1 ||
      !frequency
    )
      return;

    const installments = [];
    const currentDate = new Date(installmentDate);
    for (let i = 0; i < count; i++) {
      installments.push({
        installmentAmount,
        installmentDate: currentDate.toISOString(),
        paymentChannelAbbreviatedName,
      });
      if (frequency === "Semestral") {
        currentDate.setMonth(currentDate.getMonth() + 6);
      } else if (frequency === "Anual") {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
    }

    const updatedValues: IExtraordinaryInstallments = {
      ...initialValues,
      extraordinaryInstallments: installments,
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
    <BaseModal
      title={dataAddSeriesModal.title}
      backButton={dataAddSeriesModal.cancel}
      nextButton={dataAddSeriesModal.add}
      handleBack={handleClose}
      handleNext={handleNextClick}
      handleClose={handleClose}
      width={isMobile ? "280px" : "425px"}
      height={isMobile ? "auto" : "639px"}
      finalDivider
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
          value={formik.values.paymentChannelAbbreviatedName}
          onChange={(name, value) => handleGenericSelectChange(name, value)}
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
            handleChangeWithCurrency(
              { setFieldValue: formik.setFieldValue },
              e,
            );
          }}
          value={formik.values.value}
          size="wide"
          fullwidth
        />

        <Textfield
          name="installmentAmount"
          id="installmentAmount"
          label={dataAddSeriesModal.labelValue}
          placeholder={dataAddSeriesModal.placeHolderValue}
          iconBefore={<MdOutlineAttachMoney color={inube.palette.green.G400} />}
          onChange={(e) =>
            handleInstallmentAmountChange("installmentAmount", e.target.value)
          }
          value={
            installmentState?.installmentAmount &&
            installmentState.installmentAmount > 0
              ? currencyFormat(installmentState.installmentAmount, false)
              : ""
          }
          required
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
          size="wide"
          fullwidth
        />

        <Select
          name="installmentDate"
          id="installmentDate"
          label={dataAddSeriesModal.labelDate}
          placeholder={dataAddSeriesModal.placeHolderSelect}
          options={paymentDateOptionsMock}
          value={formik.values.installmentDate}
          onChange={(name, value) => handleGenericSelectChange(name, value)}
          size="wide"
          required
          fullwidth
        />
      </Stack>
    </BaseModal>
  );
}
