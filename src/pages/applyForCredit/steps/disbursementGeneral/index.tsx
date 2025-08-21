import { useFormik } from "formik";
import { useEffect, useContext, useState, useRef, useCallback } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { AppContext } from "@context/AppContext";
import { ICustomerData } from "@context/CustomerContext/types";
import { IProspect, IProspectSummaryById } from "@services/prospect/types";

import { DisbursementWithInternalAccount } from "./disbursementWithInternalAccount/index";
import { DisbursementWithExternalAccount } from "./disbursementWithExternalAccount";
import { DisbursementWithCheckEntity } from "./disbursementWithCheckEntity";
import { DisbursementWithCheckManagement } from "./DisbursementWithCheckManagement";
import { DisbursementWithCash } from "./DisbursementWithCash";
import { disbursemenTabs } from "./config";
import { IDisbursementGeneral } from "../../types";

interface IDisbursementGeneralProps {
  isMobile: boolean;
  initialValues: IDisbursementGeneral;
  data: IProspect;
  isSelected: string;
  identificationNumber: string;
  onFormValid: (isValid: boolean) => void;
  handleOnChange: (values: IDisbursementGeneral) => void;
  handleTabChange: (id: string) => void;
  rule?: string[];
  customerData?: ICustomerData;
  prospectSummaryData: IProspectSummaryById | undefined;
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
    prospectSummaryData,
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
    const disbursementForms: (keyof IDisbursementGeneral)[] = [
      "Internal_account",
      "External_account",
      "Certified_check",
      "Business_check",
      "Cash",
    ];

    return disbursementForms.reduce((total, key) => {
      const disbursementData = formik.values[key];
      const amount =
        disbursementData &&
        typeof disbursementData === "object" &&
        "amount" in disbursementData
          ? disbursementData.amount || 0
          : 0;
      return total + Number(amount);
    }, 0);
  }, [formik.values]);

  useEffect(() => {
    setTabChanged((prev) => !prev);
  }, [isSelected]);

  useEffect(() => {
    const totalAmount = getTotalAmount();

    const isInternalValid = formik.values.Internal_account?.amount
      ? formik.values.Internal_account.accountNumber !== ""
      : true;

    const isExternalValid = formik.values.External_account?.amount
      ? formik.values.External_account.bank !== "" &&
        formik.values.External_account.accountNumber !== "" &&
        formik.values.External_account.accountType !== ""
      : true;

    const isValid =
      totalAmount === initialValues.amount &&
      isInternalValid &&
      isExternalValid;

    onFormValid(isValid);
  }, [
    formik.values,
    onFormValid,
    handleOnChange,
    tabChanged,
    getTotalAmount,
    initialValues.amount,
    formik.values.Internal_account?.accountNumber,
    formik.values.External_account?.bank,
    formik.values.External_account?.accountNumber,
    formik.values.External_account?.accountType,
    formik.values.External_account?.bank,
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
        formik.setFieldValue("Internal_account.amount", initialValues.amount);
      }
      if (tabId === disbursemenTabs.external.id) {
        formik.setFieldValue("External_account.amount", initialValues.amount);
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

  const isAmountReadOnly = validTabs.length === 1;
  console.log(initialValues);
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
                optionNameForm="Internal_account"
                getTotalAmount={getTotalAmount}
                businessUnitPublicCode={businessUnitPublicCode}
                identificationNumber={identificationNumber}
                customerData={customerData}
                isAmountReadOnly={isAmountReadOnly}
                prospectSummaryData={prospectSummaryData}
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
                optionNameForm="External_account"
                getTotalAmount={getTotalAmount}
                businessUnitPublicCode={businessUnitPublicCode}
                identificationNumber={identificationNumber}
                customerData={customerData}
                isAmountReadOnly={isAmountReadOnly}
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
                isAmountReadOnly={isAmountReadOnly}
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
                isAmountReadOnly={isAmountReadOnly}
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
                isAmountReadOnly={isAmountReadOnly}
              />
            )}
        </Stack>
      </Stack>
    </Fieldset>
  );
}
