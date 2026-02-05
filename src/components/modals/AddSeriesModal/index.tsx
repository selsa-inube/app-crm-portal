import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import {
  Select,
  Stack,
  Textfield,
  inube,
  useMediaQuery,
  IOption,
} from "@inubekit/inubekit";
import { useIAuth } from "@inube/iauth-react";

import { BaseModal } from "@components/modals/baseModal";
import {
  currencyFormat,
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
  IProspect,
} from "@services/prospect/types";
import { EnumType } from "@hooks/useEnum/useEnum";
import { searchExtraInstallmentPaymentCyclesByCustomerCode } from "@services/creditLimit/extraInstallmentPaymentCyles/searchExtraInstallmentPaymentCyclesByCustomerCode";
import { CustomerContext } from "@context/CustomerContext";
import { CardGray } from "@components/cards/CardGray";
import { calculateSeriesForExtraordinaryInstallment } from "@services/creditLimit/calculateSeriesForExtraordinaryInstallment";
import { ICalculatedSeries } from "@services/creditRequest/types";

import { dataAddSeriesModal, defaultFrequency } from "./config";
import { saveExtraordinaryInstallment } from "../ExtraordinaryPaymentModal/utils";
import { ICycleOption } from "./types";

export interface AddSeriesModalProps {
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  toggleAddSeriesModal: () => void;
  handleClose: () => void;
  onSubmit: (values: {
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
    value: number;
  }) => void;
  lang: EnumType;
  lineOfCreditAbbreviatedName: string;
  moneyDestinationAbbreviatedName: string;
  installmentState?: {
    installmentAmount: number;
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
  };
  seriesModal?: IExtraordinaryInstallment[];
  sentData?: IExtraordinaryInstallments | null;
  selectedModal?: IExtraordinaryInstallment | null;
  prospectData?: IProspect;
  service?: boolean;
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
  isEdit?: boolean;
  isSimulateCredit?: boolean;
}

export function AddSeriesModal(props: AddSeriesModalProps) {
  const {
    prospectData,
    service = true,
    installmentState,
    lang,
    handleClose,
    onSubmit,
    setInstallmentState,
    isEdit = false,
    setSentData,
    lineOfCreditAbbreviatedName,
    moneyDestinationAbbreviatedName,
    setMessageError,
    setShowErrorModal,
    toggleAddSeriesModal,
    isSimulateCredit = false,
  } = props;
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const { user } = useIAuth();

  const isMobile = useMediaQuery("(max-width: 700px)");
  const { customerData } = useContext(CustomerContext);

  const [isLoading, setIsLoading] = useState(false);
  const [dateOptions, setDateOptions] = useState<IOption[]>([]);
  const [cycleOptions, setCycleOptions] = useState<ICycleOption[]>([]);

  const frequencyOptions: IOption[] = [
    { id: defaultFrequency, label: defaultFrequency, value: defaultFrequency },
  ];

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const formik = useFormik({
    initialValues: {
      installmentDate: "",
      installmentAmount: 0,
      paymentChannelAbbreviatedName: "",
      cycleId: "",
      value: "",
      frequency: "",
    },
    onSubmit: (values) => {
      onSubmit?.({
        installmentDate: values.installmentDate,
        paymentChannelAbbreviatedName: values.paymentChannelAbbreviatedName,
        value: values.installmentAmount,
      });
    },
  });

  useEffect(() => {
    if (isEdit && installmentState) {
      formik.setFieldValue(
        "installmentAmount",
        installmentState.installmentAmount || 0,
      );
      formik.setFieldValue(
        "paymentChannelAbbreviatedName",
        installmentState.paymentChannelAbbreviatedName || "",
      );
      formik.setFieldValue(
        "installmentDate",
        installmentState.installmentDate || "",
      );
      formik.setFieldValue("value", "");
      formik.setFieldValue("frequency", "");
    }
  }, [isEdit, installmentState]);

  useEffect(() => {
    const clientIdentificationNumber = customerData.publicCode;
    const fetchCycles = async () => {
      if (
        service &&
        customerData.publicCode &&
        lineOfCreditAbbreviatedName &&
        moneyDestinationAbbreviatedName &&
        clientIdentificationNumber
      ) {
        try {
          setIsLoading(true);
          const response =
            await searchExtraInstallmentPaymentCyclesByCustomerCode(
              businessUnitPublicCode,
              clientIdentificationNumber,
              lineOfCreditAbbreviatedName,
              moneyDestinationAbbreviatedName,
              eventData.token,
            );
          if (response === null) {
            return;
          }
          const flattenedOptions: ICycleOption[] =
            response.extraordinaryCycles.map((cycle) => ({
              id: `${response.payrollForDeductionAgreementId}-${cycle.cycleName}`,
              label: `${response.abbreviatedName} ${cycle.cycleName}`,
              value: `${response.payrollForDeductionAgreementId}-${cycle.cycleName}`,
              paymentDates: cycle.paymentDates,
              extraordinaryCycleType: cycle.extraordinaryCycleType,
              cycleName: cycle.cycleName,
            }));

          setCycleOptions(flattenedOptions);

          if (flattenedOptions.length === 1) {
            formik.setFieldValue(
              "paymentChannelAbbreviatedName",
              flattenedOptions[0].id,
            );
            handleCycleChange(
              "paymentChannelAbbreviatedName",
              flattenedOptions[0].id,
              flattenedOptions,
            );
          }

          if (flattenedOptions.length === 1) {
            handleCycleChange(
              "cycleId",
              flattenedOptions[0].id,
              flattenedOptions,
            );
          }
        } catch (error) {
          const err = error as {
            message?: string;
            status: number;
            data?: { description?: string; code?: string };
          };
          const code = err?.data?.code ? `[${err.data.code}] ` : "";
          const description =
            code + err?.message + (err?.data?.description || "");

          setShowErrorModal(true);
          setMessageError(description);
          toggleAddSeriesModal();
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCycles();
  }, [prospectData, service]);

  const handleFieldChange = (name: string, value: string) => {
    formik.setFieldValue(name, value);

    if (name === "installmentDate") {
      if (setInstallmentState) {
        setInstallmentState((prev) => ({
          ...prev,
          installmentDate: value,
        }));
      }
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

  const handleCycleChange = (
    __: string,
    value: string,
    currentOptions?: ICycleOption[],
  ) => {
    const options = currentOptions || cycleOptions;
    const selectedCycle = options.find((opt) => opt.value === value);

    formik.setFieldValue("cycleId", value);

    if (selectedCycle) {
      formik.setFieldValue(
        "paymentChannelAbbreviatedName",
        selectedCycle.extraordinaryCycleType,
      );

      const newDateOptions = selectedCycle.paymentDates.map((date) => ({
        id: date,
        label: new Date(date)
          .toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .toLowerCase(),
        value: date,
      }));

      setDateOptions(newDateOptions);

      if (setInstallmentState) {
        setInstallmentState((prev) => ({
          ...prev,
          paymentChannelAbbreviatedName: selectedCycle.extraordinaryCycleType,
        }));
      }

      if (newDateOptions.length === 1) {
        handleFieldChange("installmentDate", newDateOptions[0].value);
      } else {
        formik.setFieldValue("installmentDate", "");
      }
    } else {
      setDateOptions([]);
      formik.setFieldValue("installmentDate", "");
    }
  };

  const handleExtraordinaryInstallment = async (
    extraordinaryInstallments: Record<string, string | number>,
  ) => {
    try {
      setIsLoading(true);

      const calculateInstallments =
        await calculateSeriesForExtraordinaryInstallment(
          businessUnitPublicCode,
          eventData.token,
          user.id,
          extraordinaryInstallments,
        );

      const formattedInstallments = (calculateInstallments || []).map(
        (item) => ({
          installmentAmount: item.value,
          installmentDate: item.paymentDate,
          paymentChannelAbbreviatedName: item.paymentChannelAbbreviatedName,
        }),
      );

      const saveBody: IExtraordinaryInstallments = {
        creditProductCode:
          prospectData?.creditProducts?.[0]?.creditProductCode || "",
        extraordinaryInstallments: formattedInstallments,
        prospectId: prospectData?.prospectId || "",
      };

      const newExtraordinaryInstallments = await saveExtraordinaryInstallment(
        businessUnitPublicCode,
        saveBody,
        eventData.token,
      );

      setSentData?.(newExtraordinaryInstallments || null);
      setIsLoading(false);
      handleClose();
    } catch (error) {
      setIsLoading(false);
      const err = error as {
        message?: string;
        status?: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description =
        code + (err?.message || "") + (err?.data?.description || "");

      setShowErrorModal(true);
      setMessageError(description);
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

    const selectedCycle = cycleOptions.find(
      (option) => option.value === formik.values.cycleId,
    );

    const dateObj = new Date(installmentDate);
    const formattedDate = `${dateObj.getFullYear()}/${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dateObj.getDate().toString().padStart(2, "0")}`;

    const requestBody: Record<string, string | number> = {
      customerCode: customerData.publicCode,
      cycleName: selectedCycle?.cycleName || "",
      firstDayOfTheCycle: formattedDate,
      installmentAmount: count,
      installmentFrequency: frequency,
      paymentChannelAbbreviatedName: paymentChannelAbbreviatedName,
      value: installmentAmount,
    };

    handleExtraordinaryInstallment(requestBody);
  };

  const handleSimpleSubmit = async () => {
    if (!installmentState) return;

    const {
      installmentAmount,
      installmentDate,
      paymentChannelAbbreviatedName,
    } = installmentState;

    if (isEdit) {
      if (
        !installmentAmount ||
        !installmentDate ||
        !paymentChannelAbbreviatedName
      )
        return;

      onSubmit?.({
        installmentDate: installmentDate,
        paymentChannelAbbreviatedName: paymentChannelAbbreviatedName,
        value: installmentAmount,
      });
      return;
    }

    const count = parseInt(formik.values.value, 10);
    const frequency = formik.values.frequency;

    if (
      !installmentAmount ||
      !installmentDate ||
      !paymentChannelAbbreviatedName ||
      isNaN(count) ||
      count < 1 ||
      !frequency
    ) {
      return;
    }

    const cycleNameRaw = formik.values.cycleId
      ? formik.values.cycleId.split("-").pop()
      : "";

    const dateObj = new Date(installmentDate);
    const formattedDate = `${dateObj.getFullYear()}/${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dateObj.getDate().toString().padStart(2, "0")}`;

    const requestBody: Record<string, string | number> = {
      customerCode: customerData.publicCode,
      cycleName: cycleNameRaw || "",
      firstDayOfTheCycle: formattedDate,
      installmentAmount: count,
      installmentFrequency: frequency,
      paymentChannelAbbreviatedName: paymentChannelAbbreviatedName,
      value: installmentAmount,
    };

    try {
      setIsLoading(true);

      const response = await calculateSeriesForExtraordinaryInstallment(
        businessUnitPublicCode,
        eventData.token,
        user.id,
        requestBody,
      );

      if (response && Array.isArray(response)) {
        response.forEach((item: ICalculatedSeries) => {
          onSubmit?.({
            installmentDate: item.paymentDate,
            paymentChannelAbbreviatedName:
              item.cycleName || item.paymentChannelAbbreviatedName,
            value: item.value,
          });
        });
      }

      handleClose();
    } catch (error) {
      const err = error as {
        message?: string;
        status: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description = code + err?.message + (err?.data?.description || "");

      setMessageError(description);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (isEdit) {
      return (
        installmentState?.paymentChannelAbbreviatedName &&
        installmentState?.installmentAmount &&
        installmentState?.installmentAmount > 0 &&
        installmentState?.installmentDate
      );
    }

    const count = parseInt(formik.values.value, 10);

    return (
      installmentState?.paymentChannelAbbreviatedName &&
      installmentState?.installmentAmount &&
      installmentState?.installmentAmount > 0 &&
      installmentState?.installmentDate &&
      formik.values.frequency &&
      !isNaN(count) &&
      count > 0
    );
  };
  useEffect(() => {
    if (paymentMethodOptionsMock.length === 1) {
      const onlyOption = paymentMethodOptionsMock[0];
      formik.setFieldValue("paymentChannelAbbreviatedName", onlyOption.value);
      handleFieldChange("paymentChannelAbbreviatedName", onlyOption.value);
    }
  }, [paymentMethodOptionsMock]);

  useEffect(() => {
    if (frequencyOptionsMock.length === 1) {
      const onlyOption = frequencyOptionsMock[0];
      formik.setFieldValue("frequency", onlyOption.value);
    }
  }, [frequencyOptionsMock]);

  useEffect(() => {
    if (paymentDateOptionsMock.length === 1) {
      const onlyOption = paymentDateOptionsMock[0];
      formik.setFieldValue("installmentDate", onlyOption.value);
      handleFieldChange("installmentDate", onlyOption.value);
    }
  }, [paymentDateOptionsMock]);

  useEffect(() => {
    formik.setFieldValue("frequency", defaultFrequency);
  }, []);

  return (
    <BaseModal
      title={dataAddSeriesModal.title.i18n[lang]}
      backButton={dataAddSeriesModal.cancel.i18n[lang]}
      nextButton={dataAddSeriesModal.add.i18n[lang]}
      handleBack={handleClose}
      handleNext={!isSimulateCredit ? handleNextClick : handleSimpleSubmit}
      handleClose={handleClose}
      width={isMobile ? "280px" : "425px"}
      height="auto"
      finalDivider
      disabledNext={!isFormValid()}
      isLoading={isLoading}
    >
      <Stack gap="24px" direction="column">
        {cycleOptions.length === 1 ? (
          <CardGray
            label={dataAddSeriesModal.labelPaymentMethod.i18n[lang]}
            data={cycleOptions[0].label}
          />
        ) : (
          <Select
            name="cycleId"
            id="cycleId"
            label={dataAddSeriesModal.labelPaymentMethod.i18n[lang]}
            placeholder={dataAddSeriesModal.placeHolderSelect.i18n[lang]}
            options={cycleOptions}
            value={formik.values.cycleId}
            onChange={(name, value) => handleCycleChange(name, value)}
            size="wide"
            fullwidth
            required
          />
        )}

        {!isEdit && (
          <Textfield
            name="value"
            id="value"
            label={dataAddSeriesModal.labelAmount.i18n[lang]}
            placeholder={dataAddSeriesModal.placeHolderAmount.i18n[lang]}
            type="number"
            onChange={formik.handleChange}
            value={formik.values.value}
            fullwidth
            required
          />
        )}

        <Textfield
          name="installmentAmount"
          id="installmentAmount"
          label={dataAddSeriesModal.labelValue.i18n[lang]}
          placeholder={dataAddSeriesModal.placeHolderValue.i18n[lang]}
          iconBefore={<MdOutlineAttachMoney color={inube.palette.green.G400} />}
          onChange={(event) =>
            handleInstallmentAmountChange(
              "installmentAmount",
              event.target.value,
            )
          }
          value={
            installmentState?.installmentAmount
              ? currencyFormat(installmentState.installmentAmount, false)
              : ""
          }
          required
          fullwidth
        />

        <CardGray
          label={dataAddSeriesModal.labelFrequency.i18n[lang]}
          data={frequencyOptions[0].label}
        />

        {dateOptions.length === 1 ? (
          <CardGray
            label={dataAddSeriesModal.labelDate.i18n[lang]}
            data={dateOptions[0].label}
          />
        ) : (
          <Select
            name="installmentDate"
            id="installmentDate"
            label={dataAddSeriesModal.labelDate.i18n[lang]}
            placeholder={dataAddSeriesModal.placeHolderSelect.i18n[lang]}
            options={dateOptions}
            value={formik.values.installmentDate}
            onChange={(name, value) => handleFieldChange(name, value)}
            size="wide"
            required
            fullwidth
            disabled={!dateOptions.length}
          />
        )}
      </Stack>
    </BaseModal>
  );
}
