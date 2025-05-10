import { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
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
import { CreditLimitCard } from "@pages/addProspect/components/CreditLimitCard";
import { currencyFormat } from "@utils/formatData/currency";
import { get } from "@mocks/utils/dataMock.service";
import { loanAmount } from "@mocks/add-prospect/loan-amount/loanAmount.mock";
import {
  mockPayAmount,
  mockPeriodicity,
} from "@mocks/add-prospect/payment-channel/paymentchannel.mock";
import { mockCreditLimit } from "@mocks/add-prospect/modals-amount/modalsAmount.mock";
import { IPaymentChannel } from "@services/types";

import { dataAmount } from "./config";
import { ScrollableContainer } from "./styles";

export interface ILoanAmountProps {
  initialValues: {
    inputValue: string;
    toggleChecked: boolean;
    paymentPlan: string;
    periodicity: string;
    payAmount: string;
  };
  isMobile: boolean;
  handleOnChange: (newData: Partial<ILoanAmountProps["initialValues"]>) => void;
  onFormValid: (isValid: boolean) => void;
}

export function LoanAmount(props: ILoanAmountProps) {
  const { initialValues, isMobile, handleOnChange, onFormValid } = props;
  const { id } = useParams();
  const loanId = parseInt(id || "0", 10);
  const loanText =
    loanAmount.find((loan) => loan.id === loanId)?.choice || "expectToReceive";
  const data =
    dataAmount[
      loanText === "expectToReceive" ? "expectToReceive" : "amountRequested"
    ];
  const [requestValue, setRequestValue] = useState<IPaymentChannel[]>();
  const creditCardsData = mockCreditLimit;
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
    periodicity: Yup.string().required(""),
    payAmount: Yup.string().required(""),
  });

  return (
    <Fieldset hasOverflow>
      <Formik
        initialValues={initialValues}
        validationSchema={LoanAmountValidationSchema}
        onSubmit={() => {}}
        validate={(values) => {
          const numericValue =
            parseFloat(values.inputValue.replace(/[^0-9]/g, "")) || 0;
          const isValid =
            numericValue > 0 &&
            values.paymentPlan.trim() !== "" &&
            values.periodicity.trim() !== "" &&
            values.payAmount.trim() !== "";
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
              <Stack direction="column" alignItems="center" gap="8px">
                <Text
                  appearance="dark"
                  type="label"
                  size={isMobile ? "medium" : "large"}
                  weight="bold"
                >
                  {dataAmount.creditText}
                </Text>
                <ScrollableContainer>
                  <Stack
                    direction="row"
                    gap="24px"
                    margin="0 auto"
                    padding=" 0px 5px"
                  >
                    {creditCardsData.map((item, index) => (
                      <CreditLimitCard
                        key={index}
                        creditLineTxt={item.creditLineTxt}
                        creditLine={item.creditLine}
                        creditLimitData={item.CreditLimitdata}
                        paymentCapacityData={item.paymentCapacityData}
                        reciprocityData={item.reciprocityData}
                        scoreData={item.scoreData}
                      />
                    ))}
                  </Stack>
                </ScrollableContainer>
              </Stack>
              <Divider dashed />
              <Stack direction="column">
                <Text type="label" size="medium" weight="bold">
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
                      fullwidth={true}
                      value={values.inputValue}
                      onChange={(e) => {
                        const rawValue =
                          parseFloat(e.target.value.replace(/[^0-9]/g, "")) ||
                          0;
                        const formattedValue = currencyFormat(rawValue, false);
                        setFieldValue("inputValue", formattedValue);
                        handleOnChange({ inputValue: formattedValue });
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
                  <Text type="label" size="medium" weight="bold">
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
                        fullwidth={true}
                      />
                    )}
                  </Field>
                </Stack>
                <Stack direction="column" width="100%">
                  <Stack gap="4px">
                    <Text type="label" size="medium" weight="bold">
                      {dataAmount.Periodicity}
                    </Text>
                    <Text type="label" size="small" appearance="danger">
                      {dataAmount.Requested}
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
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </Fieldset>
  );
}
