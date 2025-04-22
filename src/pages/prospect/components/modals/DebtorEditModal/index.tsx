import { useEffect, useState } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import {
  BorrowerProperty,
  IBorrower,
  IIncomeSources,
} from "@services/incomeSources/types";
import { getPropertyValue } from "@pages/SubmitCreditApplication/util";

import { dataEditDebtor, dataTabs } from "./config";
import { DataDebtor } from "./dataDebtor";

interface IDebtorEditModalProps {
  handleClose: () => void;
  isMobile: boolean;
  initialValues: IBorrower;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate?: any;
}

export function DebtorEditModal(props: IDebtorEditModalProps) {
  const { handleClose, isMobile, initialValues, onUpdate } = props;
  const [currentTab, setCurrentTab] = useState(dataTabs[0].id);
  const [incomeData, setIncomeData] = useState<IIncomeSources | undefined>(
    undefined,
  );
  const [editedIncomeData, setEditedIncomeData] =
    useState<IIncomeSources | null>(null);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setIncomeData({
        identificationNumber: initialValues.borrower_identification_number,
        identificationType: initialValues.borrower_identification_type,
        name: getPropertyValue(initialValues.borrower_properties, "name") || "",
        surname:
          getPropertyValue(initialValues.borrower_properties, "surname") || "",
        Leases: parseFloat(
          getPropertyValue(initialValues.borrower_properties, "Leases") || "0",
        ),
        Dividends: parseFloat(
          getPropertyValue(initialValues.borrower_properties, "Dividends") ||
            "0",
        ),
        FinancialIncome: parseFloat(
          getPropertyValue(
            initialValues.borrower_properties,
            "FinancialIncome",
          ) || "0",
        ),
        PeriodicSalary: parseFloat(
          getPropertyValue(
            initialValues.borrower_properties,
            "PeriodicSalary",
          ) || "0",
        ),
        OtherNonSalaryEmoluments: parseFloat(
          getPropertyValue(
            initialValues.borrower_properties,
            "OtherNonSalaryEmoluments",
          ) || "0",
        ),
        PensionAllowances: parseFloat(
          getPropertyValue(
            initialValues.borrower_properties,
            "PensionAllowances",
          ) || "0",
        ),
        PersonalBusinessUtilities: parseFloat(
          getPropertyValue(
            initialValues.borrower_properties,
            "PersonalBusinessUtilities",
          ) || "0",
        ),
        ProfessionalFees: parseFloat(
          getPropertyValue(
            initialValues.borrower_properties,
            "ProfessionalFees",
          ) || "0",
        ),
      });
    }
  }, [initialValues]);

  const convertToPropertyArray = (
    income: IIncomeSources,
  ): BorrowerProperty[] => {
    return Object.entries(income).map(([key, value]) => ({
      property_name: key,
      property_value: String(value),
    }));
  };

  const mergeProperties = (
    original: BorrowerProperty[],
    updates: BorrowerProperty[],
  ): BorrowerProperty[] => {
    const result: BorrowerProperty[] = [];

    const duplicates = ["FinancialObligation"];
    const seen = new Map<string, BorrowerProperty>();

    original.forEach((prop) => {
      if (duplicates.includes(prop.property_name)) {
        result.push(prop);
      } else {
        seen.set(prop.property_name, prop);
      }
    });

    updates.forEach((prop) => {
      if (duplicates.includes(prop.property_name)) {
        result.push(prop);
      } else {
        seen.set(prop.property_name, prop);
      }
    });

    return [...result, ...Array.from(seen.values())];
  };

  const handleSave = () => {
    if (!initialValues || !incomeData) return;

    const updatedProps = convertToPropertyArray(editedIncomeData ?? incomeData);

    const updatedBorrower: IBorrower = {
      ...initialValues,
      borrower_properties: mergeProperties(
        initialValues.borrower_properties,
        updatedProps,
      ),
    };

    onUpdate?.(updatedBorrower);
    handleClose();
  };

  return (
    <BaseModal
      title={dataEditDebtor.title}
      nextButton={dataEditDebtor.save}
      backButton={dataEditDebtor.close}
      handleNext={handleSave}
      handleBack={handleClose}
      finalDivider={true}
      width={isMobile ? "290px" : "912px"}
      height={isMobile ? "auto" : "680px"}
      disabledNext={!isModified}
    >
      <Stack direction="column" height={isMobile ? "auto" : "510px"} gap="24px">
        <Tabs
          scroll={isMobile}
          selectedTab={currentTab}
          tabs={dataTabs}
          onChange={setCurrentTab}
        />
        {currentTab === "data" && <DataDebtor data={initialValues} />}
        {currentTab === "sources" && incomeData && (
          <SourceIncome
            data={incomeData}
            showEdit={false}
            onDataChange={(newIncome) => {
              setIsModified(true);
              setEditedIncomeData(newIncome);
            }}
          />
        )}
        {currentTab === "obligations" && (
          <TableFinancialObligations
            initialValues={initialValues}
            showActions={true}
          />
        )}
      </Stack>
    </BaseModal>
  );
}
