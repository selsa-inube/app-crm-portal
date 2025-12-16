import { useFormik } from "formik";
import { useEffect, useContext, useState, useRef, useCallback } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { AppContext } from "@context/AppContext";
import { ICustomerData } from "@context/CustomerContext/types";
import { IProspect, IProspectSummaryById } from "@services/prospect/types";

import { DisbursementWithInternalAccount } from "./disbursementWithInternalAccount/index";
import { DisbursementWithExternalAccount } from "./disbursementWithExternalAccount";

import { disbursemenTabs, disbursementGeneral } from "./config";
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
  customerData?: ICustomerData;
  prospectSummaryData: IProspectSummaryById | undefined;
  modesOfDisbursement: string[];
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
    modesOfDisbursement,
    customerData,
    prospectSummaryData,
  } = props;

  const [tabChanged, setTabChanged] = useState(false);
  const [validTabs, setValidTabs] = useState<Tab[]>([]);

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    onSubmit: () => {},
  });

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const userHasChangedTab = useRef(false);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  useEffect(() => {
    handleOnChange(formik.values);
  }, [formik.values, handleOnChange]);

  const getTotalAmount = useCallback(() => {
    return modesOfDisbursement.reduce((total, modeKey) => {
      const disbursementData =
        formik.values[modeKey as keyof IDisbursementGeneral];
      const amount =
        disbursementData &&
        typeof disbursementData === "object" &&
        "amount" in disbursementData
          ? disbursementData.amount || 0
          : 0;
      return total + Number(amount);
    }, 0);
  }, [formik.values, modesOfDisbursement]);

  const parseBaseAmount = (description: string): number => {
    const cleanedString = description.replace(/[$\s.]/g, "").replace(",", ".");
    return parseFloat(cleanedString) || 0;
  };

  useEffect(() => {
    setTabChanged((prev) => !prev);
  }, [isSelected]);

  useEffect(() => {
    let isValid = false;
    const baseAmount = parseBaseAmount(
      disbursementGeneral.description.toString(),
    );

    if (isSelected === disbursemenTabs.internal.id) {
      const internalAmount = formik.values.Internal_account?.amount || 0;
      const internalDescription =
        formik.values.Internal_account?.description || "";
      const internalAccountNumber =
        formik.values.Internal_account?.accountNumber || "";

      isValid =
        internalAmount > 0 &&
        internalAmount <= baseAmount &&
        internalDescription.trim().length > 0 &&
        internalAccountNumber.trim().length > 0;
    } else if (isSelected === disbursemenTabs.external.id) {
      const externalAmount = formik.values.External_account?.amount || 0;
      const externalDescription =
        formik.values.External_account?.description || "";
      const externalBank = formik.values.External_account?.bank || "";
      const externalAccountNumber =
        formik.values.External_account?.accountNumber || "";
      const externalAccountType =
        formik.values.External_account?.accountType || "";

      isValid =
        externalAmount > 0 &&
        externalAmount <= baseAmount &&
        externalDescription.trim().length > 0 &&
        externalBank.trim().length > 0 &&
        externalAccountNumber.trim().length > 0 &&
        externalAccountNumber !== "0" &&
        externalAccountType.trim().length > 0;
    }
    onFormValid(isValid);
  }, [formik.values, onFormValid, tabChanged, isSelected]);

  const fetchTabs = useCallback(() => {
    if (modesOfDisbursement.length === 0) return;
    const allTabs = Object.values(disbursemenTabs);
    const availableTabs = allTabs.filter((tab) =>
      modesOfDisbursement.includes(tab.id),
    );
    setValidTabs(availableTabs);
    if (availableTabs.length === 1) {
      const tabId = availableTabs[0].id;
      formik.setFieldValue(`${tabId}.amount`, initialValues.amount);
    }
    if (availableTabs.length > 0 && !userHasChangedTab.current) {
      handleTabChange(availableTabs[0].id);
    }
  }, [handleTabChange, modesOfDisbursement, initialValues.amount]);

  useEffect(() => {
    fetchTabs();
  }, [fetchTabs]);

  const handleManualTabChange = (tabId: string) => {
    userHasChangedTab.current = true;
    handleTabChange(tabId);
  };

  const isAmountReadOnly = validTabs.length === 1;

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
                businessManagerCode={businessManagerCode}
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
                businessManagerCode={businessManagerCode}
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
