import { useEffect, useRef, useState } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import {
  Stack,
  Text,
  Divider,
  useFlag,
  Toggle,
  Checkbox,
  Textarea,
  Select,
  Textfield,
  inube,
} from "@inubekit/inubekit";

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
import { IProspectSummaryById } from "@services/prospects/ProspectSummaryById/types";

interface IDisbursementWithInternalAccountProps {
  isMobile: boolean;
  initialValues: IDisbursementGeneral;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any;
  optionNameForm: string;
  identificationNumber: string;
  businessUnitPublicCode: string;
  isAmountReadOnly: boolean;
  prospectSummaryData: IProspectSummaryById | undefined;
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
    isAmountReadOnly,
    customerData,
    getTotalAmount,
    onFormValid,
    handleOnChange,
    prospectSummaryData,
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
    if (initialToggle && Number(initialValues.Internal_account.amount) > 0) {
      restoreCustomerDataFields();
    } else if (
      Number(initialValues.Internal_account.amount) === 0 &&
      initialValues.Internal_account.toggle === true
    ) {
      clearFields();
    }
  }, [initialValues.Internal_account.amount]);

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
              value: `${account.savingProductCode}`,
            });
          }
        });

        setAccountOptions(Array.from(uniqueMap.values()));
      } catch (error) {
        handleFlag(error);
        console.error("Error fetching internal accounts:", error);
        setAccountOptions([]);
      }
    }

    fetchAccounts();
  }, [currentIdentification, businessUnitPublicCode]);

  const previousIdentificationRef = useRef<string>();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!previousIdentificationRef.current) {
        previousIdentificationRef.current = currentIdentification;
        return;
      }

      if (previousIdentificationRef.current !== currentIdentification) {
        formik.setFieldValue(`${optionNameForm}.accountNumber`, "");
        previousIdentificationRef.current = currentIdentification;
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentIdentification]);

  useEffect(() => {
    if (isAmountReadOnly && accountOptions.length === 1) {
      const onlyOption = accountOptions[0];
      formik.setFieldValue(`${optionNameForm}.accountNumber`, onlyOption.value);
    }
  }, [accountOptions]);

  return (
    <Stack
      direction="column"
      padding={isMobile ? "4px 10px" : "10px 16px"}
      gap="16px"
      justifyContent="center"
    >
      <Stack direction="column" gap="20px">
        <Stack width="498px">
          <Textfield
            id="amount"
            name="amount"
            label={disbursementGeneral.label}
            placeholder={disbursementGeneral.place}
            size="compact"
            value={validateCurrencyField(
              "amount",
              formik,
              false,
              optionNameForm,
            )}
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
            iconBefore={
              <MdOutlineAttachMoney color={inube.palette.neutralAlpha.N900A} />
            }
            message={`${disbursemenOptionAccount.valueTurnFail}${currencyFormat(prospectSummaryData?.netAmountToDisburse ?? 0)}`}
            fullwidth
          />
        </Stack>
        <Stack gap="10px" direction="row" alignItems="center">
          <Checkbox
            id="featureCheckbox"
            name="featureCheckbox"
            checked={isDisabled || formik.values[optionNameForm]?.check}
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
            isMobile={isMobile}
            optionNameForm={optionNameForm}
            isReadOnly={isAutoCompleted}
            customerData={customerData}
          />
          <Divider dashed />
        </>
      )}
      <Stack width="498px">
        <Select
          id={`${optionNameForm}.accountNumber`}
          name={`${optionNameForm}.accountNumber`}
          label={disbursemenOptionAccount.labelAccount}
          placeholder={disbursemenOptionAccount.placeOption}
          size="compact"
          options={accountOptions}
          onBlur={formik.handleBlur}
          onChange={(_, value) =>
            formik.setFieldValue(`${optionNameForm}.accountNumber`, value)
          }
          value={formik.values[optionNameForm]?.accountNumber || ""}
          fullwidth
        />
      </Stack>
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
