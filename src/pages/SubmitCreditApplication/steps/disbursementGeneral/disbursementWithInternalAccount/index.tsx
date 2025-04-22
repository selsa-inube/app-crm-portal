import { useEffect, useRef, useState } from "react";
import { Checkbox } from "@inubekit/checkbox";
import { Toggle } from "@inubekit/toggle";
import { Select } from "@inubekit/select";
import { Stack, Text, Divider, useFlag } from "@inubekit/inubekit";
import { Textarea } from "@inubekit/textarea";
import { Textfield } from "@inubekit/textfield";
import {
  currencyFormat,
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import { IDisbursementGeneral } from "@pages/SubmitCreditApplication/types";
import {
  disbursementGeneral,
  disbursemenOptionAccount,
} from "@pages/SubmitCreditApplication/steps/disbursementGeneral/config";
import { GeneralInformationForm } from "@pages/SubmitCreditApplication/components/GeneralInformationForm";
import { ICustomerData } from "@context/CustomerContext/types";
import { getSearchCustomerByCode } from "@services/customers/AllCustomers";
import { getAllInternalAccounts } from "@services/integrationInternalAccounts";

interface IDisbursementWithInternalAccountProps {
  isMobile: boolean;
  initialValues: IDisbursementGeneral;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any;
  optionNameForm: string;
  identificationNumber: string;
  businessUnitPublicCode: string;
  customerData?: ICustomerData;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IDisbursementGeneral) => void;
  getTotalAmount: () => number;
}

export function DisbursementWithInternalAccount(
  props: IDisbursementWithInternalAccountProps,
) {
  const {
    isMobile,
    initialValues,
    formik,
    optionNameForm,
    identificationNumber,
    businessUnitPublicCode,
    customerData,
    getTotalAmount,
    onFormValid,
    handleOnChange,
  } = props;

  const prevValues = useRef(formik.values[optionNameForm]);

  const [isAutoCompleted, setIsAutoCompleted] = useState(false);
  const [currentIdentification, setCurrentIdentification] =
    useState(identificationNumber);
  const [accountOptions, setAccountOptions] = useState<
    { id: string; label: string; value: string }[]
  >([]);

  const { addFlag } = useFlag();

  const handleFlag = (error: unknown) => {
    addFlag({
      title: `${disbursemenOptionAccount.errorFlagInternal}`,
      description: `Error: ${error}`,
      appearance: "danger",
      duration: 5000,
    });
  };

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
    const isChecked = event.target.checked;
    formik.setFieldValue(`${optionNameForm}.toggle`, isChecked);

    if (isChecked) {
      formik.setFieldValue(`${optionNameForm}.documentType`, "");
      formik.setFieldValue(`${optionNameForm}.name`, "");
      formik.setFieldValue(`${optionNameForm}.lastName`, "");
      formik.setFieldValue(`${optionNameForm}.sex`, "");
      formik.setFieldValue(`${optionNameForm}.birthdate`, "");
      formik.setFieldValue(`${optionNameForm}.phone`, "");
      formik.setFieldValue(`${optionNameForm}.mail`, "");
      formik.setFieldValue(`${optionNameForm}.city`, "");
      formik.setFieldValue(`${optionNameForm}.identification`, "");
      setCurrentIdentification(identificationNumber);
    }
  };

  const identificationValue = formik.values[optionNameForm]?.identification;

  useEffect(() => {
    if (isAutoCompleted && identificationValue !== currentIdentification) {
      formik.setFieldValue(`${optionNameForm}.documentType`, "");
      formik.setFieldValue(`${optionNameForm}.name`, "");
      formik.setFieldValue(`${optionNameForm}.lastName`, "");
      formik.setFieldValue(`${optionNameForm}.sex`, "");
      formik.setFieldValue(`${optionNameForm}.birthdate`, "");
      formik.setFieldValue(`${optionNameForm}.phone`, "");
      formik.setFieldValue(`${optionNameForm}.mail`, "");
      formik.setFieldValue(`${optionNameForm}.city`, "");
      setIsAutoCompleted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identificationValue, currentIdentification, isAutoCompleted]);

  useEffect(() => {
    const currentAmount = Number(formik.values[optionNameForm]?.amount || 0);
    const totalAmount = props.getTotalAmount();

    if (currentAmount + totalAmount - currentAmount !== initialValues.amount) {
      formik.setFieldValue(`${optionNameForm}.check`, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values[optionNameForm]?.amount]);

  useEffect(() => {
    const identification = formik.values[optionNameForm]?.identification;

    const fetchCustomer = async () => {
      if (!identification) return;

      try {
        const customer = await getSearchCustomerByCode(
          identification,
          businessUnitPublicCode,
          true,
        );

        const data = customer?.generalAttributeClientNaturalPersons?.[0];

        const hasData = customer?.publicCode && data;

        if (hasData && customer.publicCode !== customerData?.publicCode) {
          setCurrentIdentification(identification);
          formik.setFieldValue(`${optionNameForm}.name`, data.firstNames || "");
          formik.setFieldValue(
            `${optionNameForm}.lastName`,
            data.lastNames || "",
          );
          formik.setFieldValue(`${optionNameForm}.sex`, data.gender || "");
          formik.setFieldValue(
            `${optionNameForm}.birthdate`,
            data.dateBirth || "",
          );
          formik.setFieldValue(
            `${optionNameForm}.phone`,
            data.cellPhoneContact || "",
          );
          formik.setFieldValue(
            `${optionNameForm}.mail`,
            data.emailContact || "",
          );
          formik.setFieldValue(
            `${optionNameForm}.city`,
            data.zone?.split("-")[1] || "",
          );

          setIsAutoCompleted(true);
        } else {
          setIsAutoCompleted(false);
          setCurrentIdentification(identificationNumber);
        }
      } catch (error) {
        setIsAutoCompleted(false);
      }
    };

    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values[optionNameForm]?.identification]);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await getAllInternalAccounts(
          currentIdentification,
          businessUnitPublicCode,
        );

        const uniqueMap = new Map<
          string,
          { id: string; label: string; value: string }
        >();

        response.forEach((account) => {
          const key = `${account.productDescription}-${account.savingProductCode}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, {
              id: account.savingProductCode,
              label: `${account.productDescription} - ${account.savingProductCode}`,
              value: `${account.productDescription} - ${account.savingProductCode}`,
            });
          }
        });

        setAccountOptions(Array.from(uniqueMap.values()));
      } catch (error) {
        handleFlag(error);
        console.error("Error fetching internal accounts:", error);
      }
    }

    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdentification, businessUnitPublicCode]);

  const previousIdentificationRef = useRef<string>();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!previousIdentificationRef.current) {
        previousIdentificationRef.current = currentIdentification;
        return;
      }

      if (previousIdentificationRef.current !== currentIdentification) {
        formik.setFieldValue(`${optionNameForm}.account`, "");
        previousIdentificationRef.current = currentIdentification;
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdentification]);

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
            id="featureCheckbox"
            name="featureCheckbox"
            checked={formik.values[optionNameForm]?.check}
            indeterminate={false}
            onChange={handleCheckboxChange}
            value="featureCheckbox"
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
            isReadOnly={isAutoCompleted}
            customerData={customerData}
          />
          <Divider dashed />
        </>
      )}
      <Select
        id={`${optionNameForm}.account`}
        name={`${optionNameForm}.account`}
        label={disbursemenOptionAccount.labelAccount}
        placeholder={disbursemenOptionAccount.placeOption}
        size="compact"
        options={accountOptions}
        onBlur={formik.handleBlur}
        onChange={(_, value) =>
          formik.setFieldValue(`${optionNameForm}.account`, value)
        }
        value={formik.values[optionNameForm]?.account || ""}
        fullwidth
      />
      <Textarea
        id={`${optionNameForm}.description`}
        name={`${optionNameForm}.description`}
        label={disbursemenOptionAccount.observation}
        placeholder={disbursemenOptionAccount.placeObservation}
        value={formik.values[optionNameForm]?.description || ""}
        onChange={(e) =>
          formik.setFieldValue(`${optionNameForm}.description`, e.target.value)
        }
        onBlur={formik.handleBlur}
        fullwidth
      />
    </Stack>
  );
}
