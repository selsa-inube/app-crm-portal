import { useEffect, useRef, useState } from "react";
import { MdOutlineInfo } from "react-icons/md";
import {
  Stack,
  Divider,
  useFlag,
  Textarea,
  Select,
  Box,
  Text,
  Icon,
} from "@inubekit/inubekit";
import { FormikValues } from "formik";

import { IDisbursementGeneral } from "@pages/applyForCredit/types";
import { disbursementGeneral } from "@pages/applyForCredit/steps/disbursementGeneral/config";
import { GeneralInformationForm } from "@pages/applyForCredit/components/GeneralInformationForm";
import { ICustomerData } from "@context/CustomerContext/types";
import { getSearchCustomerByCode } from "@services/customer/SearchCustomerCatalogByCode";
import { getAllInternalAccounts } from "@services/cardSavingProducts/SearchAllCardSavingProducts";
import { CardGray } from "@components/cards/CardGray";
import { BaseModal } from "@components/modals/baseModal";

import { disbursemenOptionAccount } from "../config";
import {
  StyledDividerWrapper,
  StyledRotatedDivider,
} from "../../requestedValue/styles";
import { StyledContainer } from "./style";

interface IDisbursementWithInternalAccountProps {
  isMobile: boolean;
  isTablet: boolean;
  initialValues: IDisbursementGeneral;
  formik: FormikValues;
  optionNameForm: string;
  identificationNumber: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
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
    businessManagerCode,
    getTotalAmount,
    isTablet,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const parseBaseAmount = (description: string | number): number => {
    if (typeof description === "number") return description;
    const cleanedString = description.replace(/[$\s.]/g, "").replace(",", ".");
    return parseFloat(cleanedString) || 0;
  };

  const baseAmount = parseBaseAmount(disbursementGeneral.description);
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
    async function fetchAccounts() {
      try {
        const response = await getAllInternalAccounts(
          currentIdentification,
          businessUnitPublicCode,
          businessManagerCode,
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
    if (accountOptions.length === 1) {
      const onlyOption = accountOptions[0];
      formik.setFieldValue(`${optionNameForm}.accountNumber`, onlyOption.value);
    }
  }, [accountOptions]);
  const handleInfoClick = () => {
    setIsModalOpen(true);
  };

  return (
    <Stack
      padding={isMobile ? "4px 10px" : "10px 16px"}
      gap="16px"
      justifyContent="space-between"
      direction={isTablet ? "column" : "row"}
    >
      <Stack direction="column" width={isTablet ? "auto" : "459px"} gap="16px">
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
        <Stack>
          {accountOptions.length === 1 ? (
            <CardGray
              label={disbursemenOptionAccount.labelAccount}
              placeHolder={accountOptions[0]?.label || ""}
              isMobile={isMobile}
            />
          ) : (
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
          )}
        </Stack>
        <StyledContainer>
          <Stack direction="row" gap="8px" alignItems="center">
            <Text
              type="body"
              size="medium"
              weight="normal"
              appearance="primary"
            >
              {disbursemenOptionAccount.observation}
            </Text>
            <Icon
              icon={<MdOutlineInfo />}
              size="12px"
              appearance="primary"
              onClick={handleInfoClick}
              cursor="pointer"
            />
          </Stack>
          <Textarea
            id={`${optionNameForm}.description`}
            name={`${optionNameForm}.description`}
            size="compact"
            placeholder={disbursemenOptionAccount.placeObservation}
            value={formik.values[optionNameForm]?.description || ""}
            onChange={(e) =>
              formik.setFieldValue(
                `${optionNameForm}.description`,
                e.target.value,
              )
            }
            maxLength={500}
            onBlur={formik.handleBlur}
            fullwidth
          />
        </StyledContainer>
      </Stack>
      {!isMobile && (
        <StyledDividerWrapper>
          <StyledRotatedDivider />
        </StyledDividerWrapper>
      )}
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap="12px"
      >
        <Text appearance="primary" type="body" size="large" weight="bold">
          {disbursemenOptionAccount.modal.settlement}
        </Text>
        <Box
          height={isTablet ? "auto" : "122px"}
          width={isTablet ? "100%" : "459px"}
        >
          <Stack direction="column" gap="12px">
            <Stack justifyContent="space-between">
              <Text type="label" size="large" weight="bold" appearance="dark">
                {disbursemenOptionAccount.modal.availableOnPayrollLabel}
              </Text>
              <Stack alignItems="center" gap="6px">
                <Text size="small" appearance="success">
                  {disbursemenOptionAccount.modal.value}
                </Text>
                <Text
                  type="body"
                  size="medium"
                  weight="normal"
                  appearance="dark"
                >
                  {disbursemenOptionAccount.modal.availableOnPayrollValue}
                </Text>
              </Stack>
            </Stack>
            <Stack justifyContent="space-between">
              <Text type="label" size="large" weight="bold" appearance="gray">
                {disbursemenOptionAccount.modal.prepaidInterest}
              </Text>
              <Stack alignItems="center" gap="6px">
                <Text size="small" appearance="success">
                  {disbursemenOptionAccount.modal.value}
                </Text>
                <Text
                  type="body"
                  size="medium"
                  weight="normal"
                  appearance="gray"
                >
                  {disbursemenOptionAccount.modal.prepaidInterestValue}
                </Text>
              </Stack>
            </Stack>
            <Divider />
            <Stack justifyContent="space-between">
              <Text type="label" size="large" weight="bold" appearance="dark">
                {disbursemenOptionAccount.modal.maximum}
              </Text>
              <Stack alignItems="center" gap="6px">
                <Text size="small" appearance="success">
                  {disbursemenOptionAccount.modal.value}
                </Text>
                <Text
                  type="body"
                  size="medium"
                  weight="normal"
                  appearance="dark"
                >
                  {disbursemenOptionAccount.modal.maximumValue}
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      {isModalOpen && (
        <BaseModal
          title={disbursemenOptionAccount.modalOb.title}
          width={isMobile ? "auto" : "450px"}
          nextButton={disbursemenOptionAccount.modalOb.nexButton}
          handleNext={() => setIsModalOpen(false)}
          handleClose={() => setIsModalOpen(false)}
        >
          <Text>{disbursemenOptionAccount.modalOb.description}</Text>
        </BaseModal>
      )}
    </Stack>
  );
}
