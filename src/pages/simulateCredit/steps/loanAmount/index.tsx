import { Formik, Field, Form } from "formik";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MdInfoOutline } from "react-icons/md";
import { Icon } from "@inubekit/inubekit";
import * as Yup from "yup";
import { MdOutlineAttachMoney } from "react-icons/md";
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
import { currencyFormat } from "@utils/formatData/currency";
import { loanAmount } from "@mocks/add-prospect/loan-amount/loanAmount.mock";
import { IPaymentChannel } from "@services/creditRequest/types";
import { BaseModal } from "@components/modals/baseModal";
import { IPayment } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";
import { IResponsePaymentDatesChannel } from "@services/payment-channels/SearchAllPaymentChannelsByIdentificationNumber/types";
import { formatPrimaryDate } from "@utils/formatData/date";

import { dataAmount, dataModalDisableLoanAmount } from "./config";

export interface ILoanAmountProps {
  initialValues: {
    inputValue: number | string;
    toggleChecked: boolean;
    paymentPlan: string;
    periodicity: string;
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

  const LoanAmountValidationSchema = Yup.object({
    inputValue: Yup.string().required(""),
    paymentPlan: Yup.string(),
    periodicity: Yup.string(),
    payAmount: Yup.string(),
  });

  const userHaveObligationPayments =
    obligationPayments && obligationPayments.length > 0;

  const handleCloseModalToggleState = () => {
    setShowInfoModal(false);
  };

  const selectedChannel = paymentChannel?.find(
    (channel) => channel.abbreviatedName === initialValues.paymentPlan,
  );
  const selectedCycle = selectedChannel?.regularCycles?.find(
    (cycle) => cycle.cycleName === initialValues.periodicity,
  );
  const payAmountOptions =
    selectedCycle?.detailOfPaymentDate?.map((date, index) => ({
      id: `${date}-${index}`,
      value: date,
      label: formatPrimaryDate(new Date(date)),
    })) || [];

  const periodicityOptions =
    selectedChannel?.regularCycles?.map((cycle, index) => ({
      id: `${cycle.cycleName}-${index}`,
      value: cycle.cycleName,
      label: cycle.cycleName,
    })) || [];

  const paymentChannelOptions =
    paymentChannel?.map((channel, index) => ({
      id: `${channel.abbreviatedName}-${channel.paymentChannel}-${index}`,
      value: channel.abbreviatedName,
      label: `${channel.abbreviatedName}`,
    })) || [];

  const allSelectsHaveOneOption =
    paymentChannelOptions.length === 1 &&
    periodicityOptions.length === 1 &&
    payAmountOptions.length === 1;

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
              values.periodicity.trim() !== "" &&
              values.payAmount.trim() !== "";
          }

          onFormValid(isValid);
        }}
        validateOnMount={true}
      >
        {({ values, setFieldValue }) => {
          useEffect(() => {
            if (paymentChannelOptions.length === 1) {
              const onlyOption = paymentChannelOptions[0];
              setFieldValue("paymentPlan", onlyOption.value);
              handleOnChange({
                paymentPlan: onlyOption.value,
              });
            }
          }, [paymentChannelOptions]);

          useEffect(() => {
            if (periodicityOptions.length === 1 && values.paymentPlan) {
              const onlyOption = periodicityOptions[0];
              setFieldValue("periodicity", onlyOption.value);
              handleOnChange({
                periodicity: onlyOption.value,
              });
            }
          }, [periodicityOptions, values.paymentPlan]);
          useEffect(() => {
            if (payAmountOptions.length === 1 && values.periodicity) {
              const onlyOption = payAmountOptions[0];
              setFieldValue("payAmount", onlyOption.value);
              handleOnChange({ payAmount: onlyOption.value });
            }
          }, [payAmountOptions, values.periodicity]);

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
                    {data}
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
                        value={values.inputValue}
                        placeholder={dataAmount.placeholderValue}
                        onChange={(e) => {
                          const rawValue =
                            parseFloat(e.target.value.replace(/[^0-9]/g, "")) ||
                            0;
                          const formattedValue = currencyFormat(
                            rawValue,
                            false,
                          );
                          setFieldValue("inputValue", formattedValue);
                          handleOnChange({ inputValue: rawValue });
                        }}
                      />
                    )}
                  </Field>
                </Stack>
                <Divider dashed />
                <Stack direction="column" gap="16px">
                  <Text type="body" size="medium">
                    {dataAmount.currentObligations}
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
                          onClick={() => {
                            setShowInfoModal(true);
                          }}
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
                        <Text
                          type="label"
                          size="medium"
                          weight="bold"
                          padding="0px 0px 0px 16px"
                        >
                          {dataAmount.ordinaryPayment}
                        </Text>
                        <Field name="paymentPlan">
                          {() =>
                            paymentChannelOptions.length === 1 ? (
                              <Textfield
                                id="paymentPlan"
                                placeholder={dataAmount.selectOption}
                                name="paymentPlan"
                                value={paymentChannelOptions[0]?.label || ""}
                                size="compact"
                                readOnly={true}
                                disabled={true}
                                fullwidth
                              />
                            ) : (
                              <Select
                                id="paymentPlan"
                                options={paymentChannelOptions}
                                placeholder={dataAmount.selectOption}
                                name="paymentPlan"
                                onChange={(_, newValue: string) => {
                                  setFieldValue("paymentPlan", newValue);
                                  setFieldValue("periodicity", "");
                                  setFieldValue("payAmount", "");
                                  handleOnChange({
                                    paymentPlan: newValue,
                                    periodicity: "",
                                    payAmount: "",
                                  });
                                }}
                                value={values.paymentPlan}
                                size="compact"
                                fullwidth={values.paymentPlan ? true : false}
                              />
                            )
                          }
                        </Field>
                      </Stack>
                      {values.paymentPlan && (
                        <>
                          <Stack direction="column" width="100%">
                            <Stack gap="4px">
                              <Text type="label" size="medium" weight="bold">
                                {dataAmount.Periodicity}
                              </Text>
                            </Stack>
                            <Field name="periodicity">
                              {() =>
                                periodicityOptions.length === 1 ? (
                                  <Textfield
                                    id="periodicity"
                                    placeholder={dataAmount.selectOption}
                                    name="periodicity"
                                    value={periodicityOptions[0]?.label || ""}
                                    size="compact"
                                    readOnly={true}
                                    disabled={true}
                                    fullwidth
                                  />
                                ) : (
                                  <Select
                                    id="periodicity"
                                    options={periodicityOptions}
                                    placeholder={dataAmount.selectOption}
                                    name="periodicity"
                                    onChange={(_, newValue: string) => {
                                      setFieldValue("periodicity", newValue);
                                      setFieldValue("payAmount", "");
                                      handleOnChange({
                                        periodicity: newValue,
                                        payAmount: "",
                                      });
                                    }}
                                    value={values.periodicity}
                                    size="compact"
                                    fullwidth={true}
                                  />
                                )
                              }
                            </Field>
                          </Stack>
                          {values.periodicity && (
                            <Stack direction="column" width="100%">
                              <Text type="label" size="medium" weight="bold">
                                {dataAmount.paymentDate}
                              </Text>
                              <Field name="payAmount">
                                {() =>
                                  payAmountOptions.length === 1 ? (
                                    <Textfield
                                      id="payAmount"
                                      placeholder={dataAmount.selectOption}
                                      name="payAmount"
                                      value={payAmountOptions[0]?.label || ""}
                                      size="compact"
                                      readOnly={true}
                                      disabled={true}
                                      fullwidth
                                    />
                                  ) : (
                                    <Select
                                      id="payAmount"
                                      options={payAmountOptions}
                                      placeholder={dataAmount.selectOption}
                                      name="payAmount"
                                      onChange={(_, newValue: string) => {
                                        setFieldValue("payAmount", newValue);
                                        handleOnChange({ payAmount: newValue });
                                      }}
                                      value={values.payAmount}
                                      size="compact"
                                      fullwidth={true}
                                    />
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
                  title={dataModalDisableLoanAmount.title}
                  nextButton={dataModalDisableLoanAmount.understood}
                  handleNext={handleCloseModalToggleState}
                  handleClose={handleCloseModalToggleState}
                  width={isMobile ? "280px" : "450px"}
                >
                  <Stack>
                    <Text>{dataModalDisableLoanAmount.description}</Text>
                  </Stack>
                </BaseModal>
              )}
            </Form>
          );
        }}
      </Formik>
    </Fieldset>
  );
}
