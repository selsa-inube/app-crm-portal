import { Formik, Field, Form } from "formik";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdInfoOutline } from "react-icons/md";
import { Icon, IOption } from "@inubekit/inubekit";
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
import { formatPrimaryDate } from "@utils/formatData/date";
import { loanAmount } from "@mocks/add-prospect/loan-amount/loanAmount.mock";
import { mockPeriodicity } from "@mocks/add-prospect/payment-channel/paymentchannel.mock";
import { get } from "@mocks/utils/dataMock.service";
import { IPaymentChannel } from "@services/creditRequest/types";
import { BaseModal } from "@components/modals/baseModal";
import { IPayment } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";

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
}

export function LoanAmount(props: ILoanAmountProps) {
  const {
    initialValues,
    isMobile,
    handleOnChange,
    onFormValid,
    requestValue,
    setRequestValue,
    obligationPayments,
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
  const [payAmountOptions, setPayAmountOptions] = useState<IOption[]>([]);

  useEffect(() => {
    get("mockRequest_value")
      .then((data) => {
        if (data && Array.isArray(data)) {
          setRequestValue(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching money destinations data:", error.message);
      });
  }, []);

  const LoanAmountValidationSchema = Yup.object({
    inputValue: Yup.string().required(""),
    paymentPlan: Yup.string().required(""),
    periodicity: Yup.string(),
    payAmount: Yup.string(),
  });

  const userHaveObligationPayments =
    obligationPayments && obligationPayments.length > 0;

  const handleCloseModalToggleState = () => {
    setShowInfoModal(false);
  };

  const generatePayAmountOptions = (day: number) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const nextTwoMonths = [0, 1].map((offset) => {
      const date = new Date(currentYear, currentMonth + offset, day);
      if (date.getDate() !== day) {
        date.setDate(0);
      }

      const label = formatPrimaryDate(date);
      return {
        id: `${offset + 1}`,
        label,
        value: label,
      };
    });

    return nextTwoMonths;
  };

  useEffect(() => {
    if (initialValues.periodicity.includes(dataAmount.day15)) {
      setPayAmountOptions(generatePayAmountOptions(15));
    } else if (initialValues.periodicity.includes(dataAmount.day30)) {
      setPayAmountOptions(generatePayAmountOptions(30));
    } else {
      setPayAmountOptions([]);
    }
  }, [initialValues.periodicity]);

  return (
    <Fieldset hasOverflow>
      <Formik
        initialValues={initialValues}
        validationSchema={LoanAmountValidationSchema}
        onSubmit={() => {}}
        validate={(values) => {
          const numericValue =
            parseFloat(String(values.inputValue).replace(/[^0-9]/g, "")) || 0;
          const isValid = numericValue > 0 && values.paymentPlan.trim() !== "";
          onFormValid(isValid);
        }}
        validateOnMount={true}
      >
        {({ values, setFieldValue }) => (
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
                        const formattedValue = currencyFormat(rawValue, false);
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
                    {() => (
                      <Select
                        id="paymentPlan"
                        options={requestValue || []}
                        placeholder={dataAmount.selectOption}
                        name="paymentPlan"
                        onChange={(_, newValue: string) => {
                          setFieldValue("paymentPlan", newValue);
                          handleOnChange({ paymentPlan: newValue });
                        }}
                        value={values.paymentPlan}
                        size="compact"
                        fullwidth={values.paymentPlan ? true : false}
                      />
                    )}
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
                        {() => (
                          <Select
                            id="periodicity"
                            options={mockPeriodicity}
                            placeholder={dataAmount.selectOption}
                            name="periodicity"
                            onChange={(_, newValue: string) => {
                              setFieldValue("periodicity", newValue);
                              handleOnChange({ periodicity: newValue });
                            }}
                            value={values.periodicity}
                            size="compact"
                            fullwidth={true}
                          />
                        )}
                      </Field>
                    </Stack>
                    <Stack direction="column" width="100%">
                      <Text type="label" size="medium" weight="bold">
                        {dataAmount.paymentDate}
                      </Text>
                      <Field name="payAmount">
                        {() => (
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
                        )}
                      </Field>
                    </Stack>
                  </>
                )}
              </Stack>
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
        )}
      </Formik>
    </Fieldset>
  );
}
