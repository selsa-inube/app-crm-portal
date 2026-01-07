import React, { useState } from "react";
import { MdOutlineAttachMoney, MdOutlineInfo } from "react-icons/md";
import {
  Textfield,
  inube,
  Stack,
  Divider,
  Box,
  Text,
} from "@inubekit/inubekit";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Fieldset } from "@components/data/Fieldset";
import { currencyFormat } from "@utils/formatData/currency";
import { BaseModal } from "@components/modals/baseModal";
import { unformatCurrency } from "@pages/prospect/components/modals/DebtorEditModal/utils";

import { CardCreditProspect } from "../../components/CardCreditProspect";
import { dataRequestValue } from "./config";
import { StyledDividerWrapper, StyledRotatedDivider } from "./styles";

interface IRequestedValueProps {
  initialAmount?: string;
  onValidationChange: (isValid: boolean) => void;
  onAmountChange: (amount: string) => void;
  isMobile?: boolean;
  onExceedQuota?: () => void;
}

const validationSchema = Yup.object({
  amount: Yup.number()
    .required(dataRequestValue.validation.required)
    .typeError(dataRequestValue.validation.typeError)
    .positive(dataRequestValue.validation.positive)
    .min(1, dataRequestValue.validation.min),
});
export const availableQuotaValue = Number(
  unformatCurrency(dataRequestValue.availableQuota),
);
export function RequestedValue(props: IRequestedValueProps) {
  const {
    initialAmount = "",
    onValidationChange,
    onAmountChange,
    isMobile = false,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (initialAmount) {
      formik.setFieldTouched("amount", true, true);
      formik.validateForm();
    }
  }, []);

  React.useEffect(() => {
    const isValid = formik.isValid && formik.values.amount !== "";
    onValidationChange(isValid);
  }, [formik.isValid, formik.values.amount, onValidationChange]);

  React.useEffect(() => {
    onAmountChange(formik.values.amount);
  }, [formik.values.amount, onAmountChange]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = unformatCurrency(e.target.value);
    formik.setFieldValue("amount", value);
    if (!formik.touched.amount) {
      formik.setFieldTouched("amount", true, false);
    }
  };

  const handleInfoClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          <Stack
            direction="column"
            gap="16px"
            width={isMobile ? "100%" : "300px"}
            justifyContent="center"
          >
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

          {!isMobile && (
            <StyledDividerWrapper>
              <StyledRotatedDivider />
            </StyledDividerWrapper>
          )}

          <Stack
            direction="column"
            width={isMobile ? "100%" : "300px"}
            alignItems={isMobile ? "center" : "flex-start"}
          >
            <CardCreditProspect
              title={dataRequestValue.availableQuota}
              titleQuota={dataRequestValue.availableQuotaLabel}
              borrower={dataRequestValue.borrower}
              date={new Date("2026-06-06")}
              value={dataRequestValue.interestRate}
              isMobile={isMobile}
              optionIcon={<MdOutlineInfo />}
              handleOptionClick={handleInfoClick}
            />
          </Stack>
        </Stack>
      </Fieldset>

      {isModalOpen && (
        <BaseModal
          title={dataRequestValue.modal.title}
          width={isMobile ? "auto" : "450px"}
          height="296px"
          backButton={dataRequestValue.modal.backButton}
          handleBack={handleCloseModal}
          handleClose={handleCloseModal}
        >
          <Stack direction="column" gap="16px">
            <Box height={isMobile ? "auto" : "122px"}>
              <Stack direction="column" gap="12px">
                <Stack justifyContent="space-between">
                  <Text
                    type="label"
                    size="large"
                    weight="bold"
                    appearance="dark"
                  >
                    {dataRequestValue.modal.availableOnPayrollLabel}
                  </Text>
                  <Stack alignItems="center" gap="6px">
                    <Text size="small" appearance="success">
                      {dataRequestValue.modal.value}
                    </Text>
                    <Text
                      type="body"
                      size="medium"
                      weight="normal"
                      appearance="dark"
                    >
                      {dataRequestValue.modal.availableOnPayrollValue}
                    </Text>
                  </Stack>
                </Stack>
                <Stack justifyContent="space-between">
                  <Text
                    type="label"
                    size="large"
                    weight="bold"
                    appearance="gray"
                  >
                    {dataRequestValue.modal.prepaidInterest}
                  </Text>
                  <Stack alignItems="center" gap="6px">
                    <Text size="small" appearance="success">
                      {dataRequestValue.modal.value}
                    </Text>
                    <Text
                      type="body"
                      size="medium"
                      weight="normal"
                      appearance="gray"
                    >
                      {dataRequestValue.modal.prepaidInterestValue}
                    </Text>
                  </Stack>
                </Stack>
                <Divider />
                <Stack justifyContent="space-between">
                  <Text
                    type="label"
                    size="large"
                    weight="bold"
                    appearance="dark"
                  >
                    {dataRequestValue.modal.maximum}
                  </Text>
                  <Stack alignItems="center" gap="6px">
                    <Text size="small" appearance="success">
                      {dataRequestValue.modal.value}
                    </Text>
                    <Text
                      type="body"
                      size="medium"
                      weight="normal"
                      appearance="dark"
                    >
                      {dataRequestValue.modal.maximumValue}
                    </Text>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </BaseModal>
      )}
    </>
  );
}
