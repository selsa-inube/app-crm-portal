import { useEffect, useRef, useState } from "react";
import {
  useFlag,
  Stack,
  Text,
  Divider,
  Toggle,
  Select,
  Textfield,
  Textarea,
  Input,
  Checkbox,
} from "@inubekit/inubekit";

import { typeAccount } from "@mocks/filing-application/disbursement-general/disbursementgeneral.mock";
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
import {
  IDisbursementGeneral,
  IOptionsSelect,
} from "@pages/SubmitCreditApplication/types";
import { getAllBancks } from "@services/banckAccount";
import { ICustomerData } from "@context/CustomerContext/types";
import { getSearchCustomerByCode } from "@services/customers/AllCustomers";

interface IDisbursementWithExternalAccountProps {
  isMobile: boolean;
  initialValues: IDisbursementGeneral;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any;
  optionNameForm: string;
  identificationNumber: string;
  businessUnitPublicCode: string;
  isAmountReadOnly: boolean;
  customerData?: ICustomerData;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IDisbursementGeneral) => void;
  getTotalAmount: () => number;
}

export function DisbursementWithExternalAccount(
  props: IDisbursementWithExternalAccountProps,
) {
  const {
    isMobile,
    initialValues,
    formik,
    optionNameForm,
    identificationNumber,
    businessUnitPublicCode,
    isAmountReadOnly,
    customerData,
    onFormValid,
    handleOnChange,
    getTotalAmount,
  } = props;

  const [banks, setBanks] = useState<IOptionsSelect[]>([]);
  const [isAutoCompleted, setIsAutoCompleted] = useState(false);
  const [currentIdentification, setCurrentIdentification] =
    useState(identificationNumber);

  const prevValues = useRef(formik.values[optionNameForm]);

  const { addFlag } = useFlag();

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
      const totalAmount = getTotalAmount();
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

  const restoreCustomerDataFields = () => {
    const person = customerData?.generalAttributeClientNaturalPersons?.[0];

    formik.setFieldValue(
      `${optionNameForm}.documentType`,
      person?.typeIdentification || "",
    );
    formik.setFieldValue(
      `${optionNameForm}.identification`,
      customerData?.publicCode || "",
    );
    formik.setFieldValue(`${optionNameForm}.name`, person?.firstNames || "");
    formik.setFieldValue(`${optionNameForm}.lastName`, person?.lastNames || "");
    formik.setFieldValue(`${optionNameForm}.sex`, person?.gender || "");
    formik.setFieldValue(
      `${optionNameForm}.birthdate`,
      person?.dateBirth || "",
    );
    formik.setFieldValue(
      `${optionNameForm}.phone`,
      person?.cellPhoneContact || "",
    );
    formik.setFieldValue(`${optionNameForm}.mail`, person?.emailContact || "");
    formik.setFieldValue(
      `${optionNameForm}.city`,
      person?.zone?.split("-")[1] || "",
    );
    setCurrentIdentification(customerData?.publicCode || "");
  };

  const clearFields = () => {
    const fields = [
      "documentType",
      "name",
      "lastName",
      "sex",
      "birthdate",
      "phone",
      "mail",
      "city",
      "identification",
      "accountNumber",
    ];

    fields.forEach((field) => {
      formik.setFieldValue(`${optionNameForm}.${field}`, "");
    });
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    formik.setFieldValue(`${optionNameForm}.toggle`, isChecked);

    if (isChecked) {
      restoreCustomerDataFields();
    } else {
      clearFields();
    }
  };

  useEffect(() => {
    const initialToggle = formik.values[optionNameForm]?.toggle;
    if (initialToggle && Number(initialValues.External_account.amount) > 0) {
      restoreCustomerDataFields();
    } else if (
      Number(initialValues.External_account.amount) === 0 &&
      initialValues.External_account.toggle === true
    ) {
      clearFields();
    }
  }, [initialValues.External_account.amount]);

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
  }, [identificationValue, currentIdentification, isAutoCompleted]);

  useEffect(() => {
    const currentAmount = Number(formik.values[optionNameForm]?.amount || 0);
    const totalAmount = props.getTotalAmount();

    if (currentAmount + totalAmount - currentAmount !== initialValues.amount) {
      formik.setFieldValue(`${optionNameForm}.check`, false);
    }
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
          formik.setFieldValue(
            `${optionNameForm}.documentType`,
            data.typeIdentification || "",
          );
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
  }, [formik.values[optionNameForm]?.identification]);

  useEffect(() => {
    const currentAmount = Number(formik.values[optionNameForm]?.amount || 0);
    const totalAmount = props.getTotalAmount();

    if (currentAmount + totalAmount - currentAmount !== initialValues.amount) {
      formik.setFieldValue(`${optionNameForm}.check`, false);
    }
  }, [formik.values[optionNameForm]?.amount]);

  useEffect(() => {
    const handleFlag = (error: unknown) => {
      addFlag({
        title: "Error",
        description: `Error al cargar los bancos: ${error}`,
        appearance: "danger",
        duration: 5000,
      });
    };

    const fetchBanks = async () => {
      try {
        const response = await getAllBancks();
        const formattedBanks = response.map((bank) => ({
          id: bank.bankId,
          label: bank.bankName,
          value: bank.bankName,
        }));
        setBanks(formattedBanks);
      } catch (error) {
        console.error("Error al cargar los bancos:", error);
        handleFlag(error);
      }
    };

    fetchBanks();
  }, [addFlag]);

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
          readOnly={isAmountReadOnly}
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
            isMobile={isMobile}
            optionNameForm={optionNameForm}
            isReadOnly={isAutoCompleted}
            customerData={customerData}
          />
          <Divider dashed />
        </>
      )}
      <Stack direction="row" gap="16px">
        <Select
          id={"bank"}
          name={`${optionNameForm}.bank`}
          label={disbursemenOptionAccount.labelBank}
          placeholder={disbursemenOptionAccount.placeOption}
          size="compact"
          options={banks}
          onBlur={formik.handleBlur}
          onChange={(name, value) => formik.setFieldValue(name, value)}
          value={formik.values[optionNameForm]?.bank || ""}
          fullwidth
        />
        <Select
          id={"accountType"}
          name={`${optionNameForm}.accountType`}
          label={disbursemenOptionAccount.labelAccountType}
          placeholder={disbursemenOptionAccount.placeOption}
          size="compact"
          options={typeAccount}
          onBlur={formik.handleBlur}
          onChange={(name, value) => formik.setFieldValue(name, value)}
          value={formik.values[optionNameForm]?.accountType || ""}
          fullwidth
        />
        <Input
          id={"accountNumber"}
          name={`${optionNameForm}.accountNumber`}
          label={disbursemenOptionAccount.labelAccountNumber}
          placeholder={disbursemenOptionAccount.placeAccountNumber}
          value={formik.values[optionNameForm]?.accountNumber || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullwidth={true}
          size="compact"
        ></Input>
      </Stack>
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
  );
}
