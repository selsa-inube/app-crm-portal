import { Formik, Field, Form } from "formik";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { MdInfoOutline, MdOutlineAttachMoney } from "react-icons/md";
import { Icon } from "@inubekit/inubekit";
import * as Yup from "yup";
import {
  Stack,
  Text,
  Divider,
  inube,
  Toggle,
  Textfield,
  Select,
} from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { CardGray } from "@components/cards/CardGray";
import { currencyFormat } from "@utils/formatData/currency";
import { loanAmount } from "@mocks/add-prospect/loan-amount/loanAmount.mock";
import { IPaymentChannel } from "@services/creditRequest/types";
import { BaseModal } from "@components/modals/baseModal";
import { ErrorModal } from "@components/modals/ErrorModal";
import { IPayment } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";
import { IResponsePaymentDatesChannel } from "@services/payment-channels/SearchAllPaymentChannelsByIdentificationNumber/types";
import { formatPrimaryDate } from "@utils/formatData/date";
import { EnumType } from "@hooks/useEnum/useEnum";

import { dataAmount, dataModalDisableLoanAmount } from "./config";

export interface ILoanAmountProps {
  initialValues: {
    inputValue: number | string;
    toggleChecked: boolean;
    paymentPlan: string;
    paymentCycle: string;
    payAmount: string;
  };
  isMobile: boolean;
  requestValue: IPaymentChannel[] | undefined;
  setRequestValue: React.Dispatch<
    React.SetStateAction<IPaymentChannel[] | undefined>
  >;
  handleOnChange: (newData: Partial<ILoanAmountProps["initialValues"]>) => void;
  onFormValid: (isValid: boolean) => void;
  obligationPayments: IPayment[] | undefined;
  paymentChannel: IResponsePaymentDatesChannel[] | null;
  showSelects?: boolean;
  lang: EnumType;
}

export function LoanAmount(props: ILoanAmountProps) {
  const {
    initialValues,
    isMobile,
    handleOnChange,
    onFormValid,
    obligationPayments,
    paymentChannel,
    showSelects,
    lang,
  } = props;
  const { id } = useParams();
  const loanId = parseInt(id || "0", 10);
  const loanText =
    loanAmount.find((loan) => loan.id === loanId)?.choice || "expectToReceive";
  const data =
    dataAmount[
      loanText === "expectToReceive" ? "expectToReceive" : "amountRequested"
    ];
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const LoanAmountValidationSchema = Yup.object({
    inputValue: Yup.string().required(""),
    paymentPlan: Yup.string(),
    paymentCycle: Yup.string(),
    payAmount: Yup.string(),
  });

  const userHaveObligationPayments =
    obligationPayments && obligationPayments.length > 0;

  const handleCloseModalToggleState = () => setShowInfoModal(false);

  return (
    <Fieldset hasOverflow>
      <Formik
        initialValues={initialValues}
        validationSchema={LoanAmountValidationSchema}
        onSubmit={() => {}}
        validate={(values) => {
          const numericValue =
            parseFloat(String(values.inputValue).replace(/[^0-9]/g, "")) || 0;

          let isValid = numericValue > 0;

          if (showSelects) {
            isValid =
              isValid &&
              values.paymentPlan.trim() !== "" &&
              values.paymentCycle.trim() !== "" &&
              values.payAmount.trim() !== "";
          }

          onFormValid(isValid);
        }}
        validateOnMount={true}
      >
        {({ values, setFieldValue }) => {
          const flatChannels = useMemo(() => {
            return (
              paymentChannel?.flatMap((item) => item.paymentChannels) ?? []
            );
          }, [paymentChannel]);

          const paymentChannelOptions = useMemo(() => {
            const validChannels = flatChannels.filter(
              (channel) => channel && channel.abbreviatedName,
            );

            const unique = new Map(
              validChannels.map((channel) => [
                channel.abbreviatedName,
                channel,
              ]),
            );

            return Array.from(unique.values()).map((channel, index) => ({
              id: `${channel.abbreviatedName}-${index}`,
              value: channel.abbreviatedName,
              label: channel.abbreviatedName,
            }));
          }, [flatChannels]);

          const selectedChannel = useMemo(() => {
            return flatChannels.find(
              (channel) =>
                channel.abbreviatedName === initialValues.paymentPlan,
            );
          }, [flatChannels, initialValues.paymentPlan]);

          const paymentCycleOptions = useMemo(() => {
            if (!selectedChannel) return [];
            const unique = Array.from(
              new Map(
                selectedChannel.regularCycles.map((cycle) => [
                  cycle.cycleName,
                  cycle.cycleName,
                ]),
              ).values(),
            );

            return unique.map((name, i) => ({
              id: `${name}-${i}`,
              value: name,
              label: name,
            }));
          }, [selectedChannel]);

          const selectedCycle = useMemo(() => {
            return selectedChannel?.regularCycles.find(
              (cycle) => cycle.cycleName === initialValues.paymentCycle,
            );
          }, [selectedChannel, initialValues.paymentCycle]);

          const payAmountOptions = useMemo(() => {
            if (!selectedCycle) return [];

            return Array.from(new Set(selectedCycle.detailOfPaymentDate)).map(
              (date, index) => ({
                id: `${date}-${index}`,
                value: date,
                label: formatPrimaryDate(new Date(date)),
              }),
            );
          }, [selectedCycle]);

          useEffect(() => {
            if (paymentChannelOptions.length === 1) {
              const onlyOption = paymentChannelOptions[0];
              setFieldValue("paymentPlan", onlyOption.value);
              handleOnChange({ paymentPlan: onlyOption.value });
            }
          }, [paymentChannelOptions]);

          useEffect(() => {
            if (paymentCycleOptions.length === 1 && values.paymentPlan !== "") {
              const onlyOption = paymentCycleOptions[0];
              setFieldValue("paymentCycle", onlyOption.value);
              handleOnChange({ paymentCycle: onlyOption.value });
            }
          }, [paymentCycleOptions, values.paymentPlan]);

          useEffect(() => {
            if (payAmountOptions.length === 1 && values.paymentCycle !== "") {
              const onlyOption = payAmountOptions[0];
              setFieldValue("payAmount", onlyOption.value);
              handleOnChange({ payAmount: onlyOption.value });
            }
          }, [payAmountOptions, values.paymentCycle]);

          useEffect(() => {
            if (
              showSelects &&
              paymentChannelOptions.length === 0 &&
              flatChannels.length === 0
            ) {
              setShowErrorModal(true);
            }
          }, [showSelects, paymentChannelOptions, flatChannels]);

          const allSelectsHaveOneOption =
            paymentChannelOptions.length === 1 &&
            paymentCycleOptions.length === 1 &&
            payAmountOptions.length === 1;

          return (
            <Form>
              <Stack
                direction="column"
                gap="16px"
                padding={isMobile ? "10px" : "0px 10px"}
              >
                <Stack direction="column" gap="4px">
                  <Text
                    type="label"
                    size="medium"
                    weight="bold"
                    padding="0px 0px 0px 16px"
                  >
                    {data.i18n[lang]}
                  </Text>
                  <Field name="inputValue">
                    {() => (
                      <Textfield
                        id="1"
                        size="compact"
                        iconBefore={
                          <MdOutlineAttachMoney
                            color={inube.palette.green.G400}
                          />
                        }
                        type="text"
                        value={currencyFormat(
                          Number(values.inputValue || 0),
                          false,
                        )}
                        placeholder={dataAmount.placeholderValue.i18n[lang]}
                        onChange={(e) => {
                          const raw =
                            parseFloat(e.target.value.replace(/[^0-9]/g, "")) ||
                            0;
                          setFieldValue("inputValue", raw);
                          handleOnChange({ inputValue: raw });
                        }}
                      />
                    )}
                  </Field>
                </Stack>
                <Divider dashed />
                <Stack direction="column" gap="16px">
                  <Text type="body" size="medium">
                    {dataAmount.currentObligations.i18n[lang]}
                  </Text>
                  <Stack gap="8px" alignItems="center">
                    <Toggle
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFieldValue("toggleChecked", checked);
                        handleOnChange({ toggleChecked: checked });
                      }}
                      checked={values.toggleChecked}
                      disabled={!userHaveObligationPayments}
                    />
                    {!userHaveObligationPayments && (
                      <Stack margin="2px 0">
                        <Icon
                          icon={<MdInfoOutline />}
                          appearance="primary"
                          size="16px"
                          onClick={() => setShowInfoModal(true)}
                          cursorHover
                        />
                      </Stack>
                    )}
                    <Text
                      type="label"
                      size="large"
                      weight="bold"
                      appearance={values.toggleChecked ? "success" : "danger"}
                    >
                      {values.toggleChecked ? "SI" : "NO"}
                    </Text>
                  </Stack>
                </Stack>
                {!allSelectsHaveOneOption && showSelects && (
                  <>
                    <Divider dashed />
                    <Stack direction={isMobile ? "column" : "row"} gap="16px">
                      <Stack direction="column" width="100%">
                        <Field name="paymentPlan">
                          {() =>
                            paymentChannelOptions.length === 1 ? (
                              <CardGray
                                label={dataAmount.ordinaryPayment.i18n[lang]}
                                placeHolder={
                                  paymentChannelOptions[0]?.label || ""
                                }
                              />
                            ) : (
                              <>
                                <Text
                                  type="label"
                                  size="medium"
                                  weight="bold"
                                  padding="0px 0px 0px 16px"
                                >
                                  {dataAmount.ordinaryPayment.i18n[lang]}
                                </Text>
                                <Select
                                  id="paymentPlan"
                                  name="paymentPlan"
                                  options={paymentChannelOptions}
                                  placeholder={
                                    dataAmount.selectOption.i18n[lang]
                                  }
                                  value={values.paymentPlan}
                                  size="compact"
                                  fullwidth
                                  onChange={(_, newValue: string) => {
                                    setFieldValue("paymentPlan", newValue);
                                    setFieldValue("paymentCycle", "");
                                    setFieldValue("payAmount", "");
                                    handleOnChange({
                                      paymentPlan: newValue,
                                      paymentCycle: "",
                                      payAmount: "",
                                    });
                                  }}
                                />
                              </>
                            )
                          }
                        </Field>
                      </Stack>
                      {values.paymentPlan && (
                        <>
                          <Stack direction="column" width="100%">
                            <Field name="paymentCycle">
                              {() =>
                                paymentCycleOptions.length === 1 ? (
                                  <CardGray
                                    label={dataAmount.paymentCycle.i18n[lang]}
                                    placeHolder={
                                      paymentCycleOptions[0]?.label || ""
                                    }
                                  />
                                ) : (
                                  <>
                                    <Text
                                      type="label"
                                      size="medium"
                                      weight="bold"
                                    >
                                      {dataAmount.paymentCycle.i18n[lang]}
                                    </Text>
                                    <Select
                                      id="paymentCycle"
                                      name="paymentCycle"
                                      options={paymentCycleOptions}
                                      placeholder={
                                        dataAmount.selectOption.i18n[lang]
                                      }
                                      value={values.paymentCycle}
                                      size="compact"
                                      fullwidth
                                      onChange={(_, newValue: string) => {
                                        setFieldValue("paymentCycle", newValue);
                                        setFieldValue("payAmount", "");
                                        handleOnChange({
                                          paymentCycle: newValue,
                                          payAmount: "",
                                        });
                                      }}
                                    />
                                  </>
                                )
                              }
                            </Field>
                          </Stack>
                          {values.paymentCycle && (
                            <Stack direction="column" width="100%">
                              <Field name="payAmount">
                                {() =>
                                  payAmountOptions.length === 1 ? (
                                    <CardGray
                                      label={dataAmount.paymentDate.i18n[lang]}
                                      placeHolder={
                                        payAmountOptions[0]?.label || ""
                                      }
                                    />
                                  ) : (
                                    <>
                                      <Text
                                        type="label"
                                        size="medium"
                                        weight="bold"
                                      >
                                        {dataAmount.paymentDate.i18n[lang]}
                                      </Text>
                                      <Select
                                        id="payAmount"
                                        name="payAmount"
                                        options={payAmountOptions}
                                        placeholder={
                                          dataAmount.selectOption.i18n[lang]
                                        }
                                        value={values.payAmount}
                                        size="compact"
                                        fullwidth
                                        onChange={(_, newValue: string) => {
                                          setFieldValue("payAmount", newValue);
                                          handleOnChange({
                                            payAmount: newValue,
                                          });
                                        }}
                                      />
                                    </>
                                  )
                                }
                              </Field>
                            </Stack>
                          )}
                        </>
                      )}
                    </Stack>
                  </>
                )}
              </Stack>
              {showInfoModal && (
                <BaseModal
                  title={dataModalDisableLoanAmount.title.i18n[lang]}
                  nextButton={dataModalDisableLoanAmount.understood.i18n[lang]}
                  handleNext={handleCloseModalToggleState}
                  handleClose={handleCloseModalToggleState}
                  width={isMobile ? "280px" : "450px"}
                >
                  <Stack>
                    <Text>
                      {dataModalDisableLoanAmount.description.i18n[lang]}
                    </Text>
                  </Stack>
                </BaseModal>
              )}
              {showErrorModal && (
                <ErrorModal
                  handleClose={() => setShowErrorModal(false)}
                  message={dataAmount.descriptionErrorModal.i18n[lang]}
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </Fieldset>
  );
}
