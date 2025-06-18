import { Formik, Field, Form } from "formik";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
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
import {
  mockPayAmount,
  mockPeriodicity,
} from "@mocks/add-prospect/payment-channel/paymentchannel.mock";
import { get } from "@mocks/utils/dataMock.service";
import { IPaymentChannel } from "@services/types";

import { dataAmount } from "./config";

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
}

export function LoanAmount(props: ILoanAmountProps) {
  const {
    initialValues,
    isMobile,
    handleOnChange,
    onFormValid,
    requestValue,
    setRequestValue,
  } = props;
  const { id } = useParams();
  const loanId = parseInt(id || "0", 10);
  const loanText =
    loanAmount.find((loan) => loan.id === loanId)?.choice || "expectToReceive";
  const data =
    dataAmount[
      loanText === "expectToReceive" ? "expectToReceive" : "amountRequested"
    ];

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
                  />
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
                            options={mockPayAmount}
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
          </Form>
        )}
      </Formik>
    </Fieldset>
  );
}
