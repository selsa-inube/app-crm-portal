import { useFormik } from "formik";
import { useEffect, useContext, useState, useRef, useCallback } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { AppContext } from "@context/AppContext";
import { ICustomerData } from "@context/CustomerContext/types";

import { DisbursementWithInternalAccount } from "./disbursementWithInternalAccount/index";
import { DisbursementWithExternalAccount } from "./disbursementWithExternalAccount";
import { DisbursementWithCheckEntity } from "./disbursementWithCheckEntity";
import { DisbursementWithCheckManagement } from "./DisbursementWithCheckManagement";
import { DisbursementWithCash } from "./DisbursementWithCash";
import { disbursemenTabs } from "./config";

interface IDisbursementGeneralProps {
  isMobile: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  isSelected: string;
  identificationNumber: string;
  onFormValid: (isValid: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnChange: (values: any) => void;
  handleTabChange: (id: string) => void;
  rule?: string[];
  customerData?: ICustomerData;
}

interface Tab {
  id: string;
  disabled: boolean;
  label: string;
}

export function DisbursementGeneral(props: IDisbursementGeneralProps) {
  const {
    isMobile,
    initialValues,
    isSelected,
    identificationNumber,
    onFormValid,
    handleOnChange,
    handleTabChange,
    rule,
    customerData,
  } = props;

  const [tabChanged, setTabChanged] = useState(false);

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    onSubmit: () => {},
  });

  const { businessUnitSigla } = useContext(AppContext);
  const userHasChangedTab = useRef(false);

  const [validTabs, setValidTabs] = useState<Tab[]>([]);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  useEffect(() => {
    handleOnChange(formik.values);
  }, [formik.values, handleOnChange]);

  const getTotalAmount = useCallback(() => {
    const disbursementForms = [
      "Internal_account_payment",
      "External_account_payment",
      "Certified_check",
      "Business_check",
      "Cash",
    ];

    return disbursementForms.reduce((total, key) => {
      const amount = formik.values[key]?.amount || 0;
      return total + Number(amount);
    }, 0);
  }, [formik.values]);

  useEffect(() => {
    setTabChanged((prev) => !prev);
  }, [isSelected]);

  useEffect(() => {
    const totalAmount = getTotalAmount();
    onFormValid(
      formik.values.Internal_account_payment?.amount
        ? totalAmount === initialValues.amount &&
            initialValues.Internal_account_payment.accountNumber !== ""
        : totalAmount === initialValues.amount,
    );
  }, [
    formik.values,
    onFormValid,
    tabChanged,
    getTotalAmount,
    initialValues.amount,
    initialValues.Internal_account_payment.accountNumber,
  ]);

  const fetchTabs = useCallback(() => {
    const validDisbursements = Array.isArray(rule) ? rule : [];

    const allTabs = Object.values(disbursemenTabs);

    const availableTabs = allTabs.filter((tab) =>
      validDisbursements.includes(tab.id),
    );

    setValidTabs(availableTabs);

    if (availableTabs.length === 1) {
      const tabId = availableTabs[0].id;
      if (tabId === disbursemenTabs.internal.id) {
        formik.setFieldValue(
          "Internal_account_payment.amount",
          initialValues.amount,
        );
      }
      if (tabId === disbursemenTabs.external.id) {
        formik.setFieldValue(
          "External_account_payment.amount",
          initialValues.amount,
        );
      }
      if (tabId === disbursemenTabs.check.id) {
        formik.setFieldValue("Certified_check.amount", initialValues.amount);
      }
      if (tabId === disbursemenTabs.management.id) {
        formik.setFieldValue("Business_check.amount", initialValues.amount);
      }
      if (tabId === disbursemenTabs.cash.id) {
        formik.setFieldValue("Cash.amount", initialValues.amount);
      }
    }

    if (availableTabs.length > 0 && !userHasChangedTab.current) {
      handleTabChange(availableTabs[0].id);
    }
  }, [handleTabChange, rule]);

  useEffect(() => {
    fetchTabs();
  }, []);

  const handleManualTabChange = (tabId: string) => {
    userHasChangedTab.current = true;
    handleTabChange(tabId);
  };

  return (
    <Fieldset>
      <Stack
        direction="column"
        padding={isMobile ? "4px 10px" : "10px 16px"}
        gap="20px"
      >
        <Stack direction="column">
          <Tabs
            tabs={validTabs}
            selectedTab={isSelected}
            onChange={handleManualTabChange}
            scroll={isMobile}
          />
          {validTabs.some((tab) => tab.id === disbursemenTabs.internal.id) &&
            isSelected === disbursemenTabs.internal.id && (
              <DisbursementWithInternalAccount
                isMobile={isMobile}
                onFormValid={onFormValid}
                initialValues={initialValues}
                handleOnChange={handleOnChange}
                formik={formik}
                optionNameForm="Internal_account_payment"
                getTotalAmount={getTotalAmount}
                businessUnitPublicCode={businessUnitPublicCode}
                identificationNumber={identificationNumber}
                customerData={customerData}
              />
            )}
          {validTabs.some((tab) => tab.id === disbursemenTabs.external.id) &&
            isSelected === disbursemenTabs.external.id && (
              <DisbursementWithExternalAccount
                isMobile={isMobile}
                onFormValid={onFormValid}
                initialValues={initialValues}
                handleOnChange={handleOnChange}
                formik={formik}
                optionNameForm="External_account_payment"
                getTotalAmount={getTotalAmount}
                businessUnitPublicCode={businessUnitPublicCode}
                identificationNumber={identificationNumber}
                customerData={customerData}
              />
            )}
          {validTabs.some((tab) => tab.id === disbursemenTabs.check.id) &&
            isSelected === disbursemenTabs.check.id && (
              <DisbursementWithCheckEntity
                isMobile={isMobile}
                onFormValid={onFormValid}
                initialValues={initialValues}
                handleOnChange={handleOnChange}
                formik={formik}
                optionNameForm="Certified_check"
                getTotalAmount={getTotalAmount}
                businessUnitPublicCode={businessUnitPublicCode}
                identificationNumber={identificationNumber}
                customerData={customerData}
              />
            )}
          {validTabs.some((tab) => tab.id === disbursemenTabs.management.id) &&
            isSelected === disbursemenTabs.management.id && (
              <DisbursementWithCheckManagement
                isMobile={isMobile}
                onFormValid={onFormValid}
                initialValues={initialValues}
                handleOnChange={handleOnChange}
                formik={formik}
                optionNameForm="Business_check"
                getTotalAmount={getTotalAmount}
                businessUnitPublicCode={businessUnitPublicCode}
                identificationNumber={identificationNumber}
                customerData={customerData}
              />
            )}
          {validTabs.some((tab) => tab.id === disbursemenTabs.cash.id) &&
            isSelected === disbursemenTabs.cash.id && (
              <DisbursementWithCash
                isMobile={isMobile}
                onFormValid={onFormValid}
                initialValues={initialValues}
                handleOnChange={handleOnChange}
                formik={formik}
                optionNameForm="Cash"
                getTotalAmount={getTotalAmount}
                businessUnitPublicCode={businessUnitPublicCode}
                identificationNumber={identificationNumber}
                customerData={customerData}
              />
            )}
        </Stack>
      </Stack>
    </Fieldset>
  );
}
