import { useEffect, useRef, useState } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import {
  useFlag,
  Stack,
  Text,
  Divider,
  Select,
  Textfield,
  Textarea,
  Input,
  Checkbox,
  inube,
} from "@inubekit/inubekit";
import { FormikValues } from "formik";

import { typeAccount } from "@mocks/filing-application/disbursement-general/disbursementgeneral.mock";
import {
  currencyFormat,
  handleChangeWithCurrency,
  validateCurrencyField,
} from "@utils/formatData/currency";
import {
  disbursementGeneral,
  disbursemenOptionAccount,
} from "@pages/applyForCredit/steps/disbursementGeneral/config";
import {
  IDisbursementGeneral,
  IOptionsSelect,
} from "@pages/applyForCredit/types";
import { getAllBancks } from "@services/bank/SearchAllBank";
import { ICustomerData } from "@context/CustomerContext/types";
import { getSearchCustomerByCode } from "@services/customer/SearchCustomerCatalogByCode";
import { StyledContainer } from "@pages/payrollOrnBonus/styles";

interface IDisbursementWithExternalAccountProps {
  isMobile: boolean;
  initialValues: IDisbursementGeneral;
  formik: FormikValues;
  optionNameForm: string;
  identificationNumber: string;
  businessUnitPublicCode: string;
  isAmountReadOnly: boolean;
  businessManagerCode: string;
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
    businessManagerCode,
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

  const parseBaseAmount = (description: string | number): number => {
    if (typeof description === "number") return description;
    const cleanedString = description.replace(/[$\s.]/g, "").replace(",", ".");
    return parseFloat(cleanedString) || 0;
  };

  const baseAmount = parseBaseAmount(disbursementGeneral.description);
  const totalAmount = getTotalAmount();
  const remainingAmount = baseAmount - totalAmount;
  const currentAmount = Number(formik.values[optionNameForm]?.amount || 0);
  const isAmountExceeded = totalAmount > baseAmount;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    formik.setFieldValue(`${optionNameForm}.check`, isChecked);

    if (isChecked) {
      const otherTabsTotal = totalAmount - currentAmount;
      const amountToFill = baseAmount - otherTabsTotal;
      formik.setFieldValue(
        `${optionNameForm}.amount`,
        amountToFill > 0 ? amountToFill : 0,
      );
    } else {
      formik.setFieldValue(`${optionNameForm}.amount`, 0);
    }
  };

  const handleCheckboxClick = () => {
    const otherTabsTotal = totalAmount - currentAmount;
    const remainingToFill = baseAmount - otherTabsTotal;

    if (remainingToFill > 0) {
      formik.setFieldValue(`${optionNameForm}.amount`, remainingToFill);
      formik.setFieldValue(`${optionNameForm}.check`, true);
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
    const totalAmount = getTotalAmount();
    if (totalAmount !== baseAmount) {
      formik.setFieldValue(`${optionNameForm}.check`, false);
    }
  }, [formik.values[optionNameForm]?.amount, getTotalAmount]);

  useEffect(() => {
    const identification = formik.values[optionNameForm]?.identification;

    const fetchCustomer = async () => {
      if (!identification) return;

      try {
        const customer = await getSearchCustomerByCode(
          identification,
          businessUnitPublicCode,
          businessManagerCode,
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
  }, [initialValues]);

  useEffect(() => {
    if (banks.length === 1) {
      const onlyBank = banks[0];
      formik.setFieldValue(`${optionNameForm}.bank`, onlyBank.value);
    }
  }, [banks]);

  useEffect(() => {
    if (typeAccount.length === 1) {
      const onlyType = typeAccount[0];
      formik.setFieldValue(`${optionNameForm}.accountType`, onlyType.value);
    }
  }, [typeAccount]);

  return (
    <Stack
      direction="column"
      padding={isMobile ? "4px 10px" : "10px 16px"}
      gap="16px"
      justifyContent="center"
    >
      <Stack gap="20px" justifyContent="space-between">
        <Stack direction="column" gap="10px">
          <Textfield
            id="amount"
            name="amount"
            label={disbursementGeneral.label}
            placeholder={disbursementGeneral.place}
            iconBefore={
              <MdOutlineAttachMoney color={inube.palette.neutralAlpha.N900A} />
            }
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
              isAmountExceeded ||
              (formik.touched[optionNameForm]?.amount && currentAmount === 0)
                ? "invalid"
                : undefined
            }
            readOnly={isAmountReadOnly}
            message={
              isAmountExceeded
                ? `El monto total no puede superar ${currencyFormat(baseAmount)}`
                : `${disbursemenOptionAccount.valueTurnFail}${currencyFormat(initialValues.amount, false)}`
            }
            fullwidth
          />
          <Stack gap="10px" direction="row" alignItems="center">
            <div onClick={handleCheckboxClick}>
              <Checkbox
                id={"featureCheckbox"}
                name={"featureCheckbox"}
                checked={formik.values[optionNameForm]?.check}
                indeterminate={false}
                onChange={handleCheckboxChange}
                value={"featureCheckbox"}
                disabled={false}
              />
            </div>
            <Text type="label" size="medium" onClick={handleCheckboxClick}>
              {disbursementGeneral.labelCheck}
            </Text>
          </Stack>
        </Stack>
        <StyledContainer>
          <Text type="label" size="small" appearance="dark">
            {disbursementGeneral.labelValue}
          </Text>
          <Text
            type="label"
            size="small"
            appearance={isAmountExceeded ? "danger" : "gray"}
          >
            {isAmountExceeded
              ? "Monto excedido"
              : currencyFormat(remainingAmount >= 0 ? remainingAmount : 0)}
          </Text>
        </StyledContainer>
      </Stack>
      <Divider dashed />

      <Stack direction={isMobile ? "column" : "row"} gap="16px">
        {banks.length === 1 ? (
          <Textfield
            id={`${optionNameForm}.bank`}
            name={`${optionNameForm}.bank`}
            label={disbursemenOptionAccount.labelBank}
            placeholder={disbursemenOptionAccount.placeOption}
            size="compact"
            value={banks[0]?.label || ""}
            readOnly={true}
            disabled={true}
            fullwidth
          />
        ) : (
          <Select
            id={`${optionNameForm}.bank`}
            name={`${optionNameForm}.bank`}
            label={disbursemenOptionAccount.labelBank}
            placeholder={disbursemenOptionAccount.placeOption}
            size="compact"
            options={banks}
            onBlur={formik.handleBlur}
            onChange={(_, value) =>
              formik.setFieldValue(`${optionNameForm}.bank`, value)
            }
            value={formik.values[optionNameForm]?.bank || ""}
            fullwidth
          />
        )}
        {typeAccount.length === 1 ? (
          <Textfield
            id={"accountType"}
            name={`${optionNameForm}.accountType`}
            label={disbursemenOptionAccount.labelAccountType}
            placeholder={disbursemenOptionAccount.placeOption}
            size="compact"
            value={typeAccount[0]?.label || ""}
            readOnly={true}
            disabled={true}
            fullwidth
          />
        ) : (
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
        )}

        <Input
          id={"accountNumber"}
          name={`${optionNameForm}.accountNumber`}
          label={disbursemenOptionAccount.labelAccountNumber}
          placeholder={disbursemenOptionAccount.placeAccountNumber}
          value={formik.values[optionNameForm]?.accountNumber || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              formik.setFieldValue(`${optionNameForm}.accountNumber`, value);
            }
          }}
          onBlur={formik.handleBlur}
          fullwidth={true}
          size="compact"
        />
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
