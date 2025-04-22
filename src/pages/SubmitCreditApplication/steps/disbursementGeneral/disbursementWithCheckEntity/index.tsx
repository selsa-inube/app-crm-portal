import { useEffect, useRef } from "react";
import { Checkbox } from "@inubekit/checkbox";
import { Toggle } from "@inubekit/toggle";
import { Stack, Text, Divider } from "@inubekit/inubekit";
import { Textarea } from "@inubekit/textarea";
import { Textfield } from "@inubekit/textfield";

import {
  currencyFormat,
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import {
  disbursementGeneral,
  disbursemenOptionAccount,
} from "@pages/SubmitCreditApplication/steps/disbursementGeneral/config";
import { GeneralInformationForm } from "@pages/SubmitCreditApplication/components/GeneralInformationForm";
import { IDisbursementGeneral } from "@pages/SubmitCreditApplication/types";

interface IDisbursementWithCheckEntityProps {
  isMobile: boolean;
  initialValues: IDisbursementGeneral;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any;
  optionNameForm: string;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IDisbursementGeneral) => void;
  getTotalAmount: () => number;
}

export function DisbursementWithCheckEntity(
  props: IDisbursementWithCheckEntityProps,
) {
  const {
    isMobile,
    initialValues,
    formik,
    optionNameForm,
    onFormValid,
    handleOnChange,
    getTotalAmount,
  } = props;

  const prevValues = useRef(formik.values[optionNameForm]);

  useEffect(() => {
    onFormValid(formik.isValid);
  }, [formik.isValid, onFormValid]);

  useEffect(() => {
    if (formik.values[optionNameForm]) {
      const updatedValues = {
        ...initialValues,
        [optionNameForm]: { ...formik.values[optionNameForm] },
      };

      if (
        JSON.stringify(prevValues.current) !==
        JSON.stringify(formik.values[optionNameForm])
      ) {
        handleOnChange(updatedValues as IDisbursementGeneral);
        prevValues.current = { ...formik.values[optionNameForm] };
      }
    }
  }, [formik.values, handleOnChange, initialValues, optionNameForm]);

  const totalAmount = getTotalAmount();
  const isDisabled = totalAmount >= initialValues.amount;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    formik.setFieldValue(`${optionNameForm}.check`, isChecked);

    if (isChecked) {
      const remainingAmount = initialValues.amount - totalAmount;

      if (remainingAmount > 0) {
        const currentAmount = Number(
          formik.values[optionNameForm]?.amount || 0,
        );
        const newAmount = currentAmount + remainingAmount;

        formik.setFieldValue(`${optionNameForm}.amount`, newAmount);
      }
    }
  };
  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(`${optionNameForm}.toggle`, event.target.checked);
  };

  useEffect(() => {
    const currentAmount = Number(formik.values[optionNameForm]?.amount || 0);
    const totalAmount = props.getTotalAmount();

    if (currentAmount + totalAmount - currentAmount !== initialValues.amount) {
      formik.setFieldValue(`${optionNameForm}.check`, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values[optionNameForm]?.amount]);

  return (
    <Stack
      direction="column"
      padding={isMobile ? "4px 10px" : "10px 16px"}
      gap="10px"
      justifyContent="center"
    >
      <Stack direction="column" gap="20px">
        <Textfield
          id="amount"
          name="amount"
          label={disbursementGeneral.label}
          placeholder={disbursementGeneral.place}
          size="compact"
          value={validateCurrencyField("amount", formik, true, optionNameForm)}
          onChange={(e) => {
            handleChangeWithCurrency(formik, e, optionNameForm);
          }}
          onBlur={() => {
            formik.setFieldTouched(`${optionNameForm}.amount`, true);
            formik.handleBlur(`amount`);
          }}
          status={
            formik.touched[optionNameForm]?.amount && !isDisabled
              ? "invalid"
              : undefined
          }
          message={`${disbursemenOptionAccount.valueTurnFail}${currencyFormat(initialValues.amount, false)}`}
          fullwidth
        />
        <Stack gap="10px" direction="row" alignItems="center">
          <Checkbox
            id={"featureCheckbox"}
            name={"featureCheckbox"}
            checked={formik.values[optionNameForm]?.check}
            indeterminate={false}
            onChange={handleCheckboxChange}
            value={"featureCheckbox"}
            disabled={isDisabled}
          />
          <Text type="label" size="medium">
            {disbursementGeneral.labelCheck}
          </Text>
        </Stack>
      </Stack>
      <Divider dashed />
      <Stack direction="column" gap="16px">
        <Text type="label" size="medium">
          {disbursementGeneral.labelToggle}
        </Text>
      </Stack>
      <Stack direction="row" gap="16px">
        <Toggle
          id="toggle"
          name="toggle"
          checked={formik.values[optionNameForm]?.toggle}
          disabled={false}
          margin="0px"
          onChange={handleToggleChange}
          padding="0px"
          size="large"
          value="toggle"
        />
        <Text
          appearance={
            formik.values[optionNameForm]?.toggle ? "success" : "danger"
          }
        >
          {formik.values[optionNameForm]?.toggle
            ? disbursementGeneral.optionToggleYes
            : disbursementGeneral.optionToggleNo}
        </Text>
      </Stack>
      <Divider dashed />
      {!formik.values[optionNameForm]?.toggle && (
        <>
          <GeneralInformationForm
            formik={formik}
            optionNameForm={optionNameForm}
          />
          <Divider dashed />
        </>
      )}
      <Stack direction="row" gap="16px">
        <Textarea
          id={"description"}
          name={`${optionNameForm}.description`}
          label={disbursemenOptionAccount.observation}
          placeholder={disbursemenOptionAccount.placeObservation}
          value={formik.values[optionNameForm]?.description || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth
        />
      </Stack>
    </Stack>
  );
}
