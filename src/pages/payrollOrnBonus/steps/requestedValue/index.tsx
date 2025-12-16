import React from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import { Text, Textfield, inube, Stack } from "@inubekit/inubekit";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Fieldset } from "@components/data/Fieldset";
import { currencyFormat } from "@utils/formatData/currency";

import { CardCreditProspect } from "../../components/CardCreditProspect";
import { dataRequestValue } from "./config";
import { StyledDividerWrapper, StyledRotatedDivider } from "./styles";

interface IRequestedValueProps {
  initialAmount?: string;
  onValidationChange: (isValid: boolean) => void;
  onAmountChange: (amount: string) => void;
  isMobile?: boolean;
}

const availableQuota = Number(
  dataRequestValue.availableQuota.replace(/\D/g, ""),
);

const validationSchema = Yup.object({
  amount: Yup.number()
    .required(dataRequestValue.validation.required)
    .typeError(dataRequestValue.validation.typeError)
    .positive(dataRequestValue.validation.positive)
    .min(1, dataRequestValue.validation.min)
    .max(
      availableQuota,
      `${dataRequestValue.validation.maxPrefix} (${currencyFormat(
        availableQuota,
        true,
      )})`,
    ),
});

export function RequestedValue(props: IRequestedValueProps) {
  const {
    initialAmount = "",
    onValidationChange,
    onAmountChange,
    isMobile = false,
  } = props;

  const formik = useFormik({
    initialValues: {
      amount: initialAmount,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {},
  });

  React.useEffect(() => {
    const isValid = formik.isValid && formik.values.amount !== "";
    onValidationChange(isValid);
  }, [formik.isValid, formik.values.amount, onValidationChange]);

  React.useEffect(() => {
    onAmountChange(formik.values.amount);
  }, [formik.values.amount, onAmountChange]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    formik.setFieldValue("amount", value);
  };

  const displayValue = formik.values.amount
    ? currencyFormat(Number(formik.values.amount), false)
    : "";

  return (
    <>
      <Fieldset>
        <Stack
          justifyContent="center"
          alignItems="stretch"
          gap="40px"
          wrap="nowrap"
          direction={isMobile ? "column" : "row"}
        >
          <Stack direction="column" width={isMobile ? "100%" : "300px"}>
            <CardCreditProspect
              title={dataRequestValue.availableQuota}
              titleQuota={dataRequestValue.availableQuotaLabel}
              borrower={dataRequestValue.borrower}
              date={new Date("2026-06-06")}
              value={dataRequestValue.interestRate}
              isMobile={isMobile}
            />
          </Stack>

          {!isMobile && (
            <StyledDividerWrapper>
              <StyledRotatedDivider />
            </StyledDividerWrapper>
          )}

          <Stack
            direction="column"
            gap="16px"
            width={isMobile ? "100%" : "300px"}
          >
            <Text size="medium">{dataRequestValue.description}</Text>

            <Textfield
              id="amount"
              name="amount"
              label={dataRequestValue.title}
              placeholder={dataRequestValue.place}
              size="compact"
              iconBefore={
                <MdOutlineAttachMoney
                  color={inube.palette.neutralAlpha.N900A}
                />
              }
              fullwidth
              required
              value={displayValue}
              onChange={handleAmountChange}
              onBlur={formik.handleBlur}
              status={
                formik.touched.amount && formik.errors.amount
                  ? "invalid"
                  : undefined
              }
              message={
                formik.touched.amount && formik.errors.amount
                  ? String(formik.errors.amount)
                  : ""
              }
            />
          </Stack>
        </Stack>
      </Fieldset>
    </>
  );
}
