import { useEffect, useState } from "react";
import { Stack, Tabs, useFlag } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { getPropertyValue } from "@utils/mappingData/mappings";
import { IBorrower, IBorrowerProperty } from "@services/prospect/types";
import { IIncomeSources } from "@services/creditLimit/types";

import { dataEditDebtor, dataTabs, dataReport } from "./config";
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

  const { addFlag } = useFlag();

  const handleFlag = () => {
    addFlag({
      title: `${dataReport.titleAdd}`,
      description: `${dataReport.descriptionFlagAdd}`,
      appearance: "success",
      duration: 5000,
    });
  };

  useEffect(() => {
    if (initialValues) {
      setIncomeData({
        identificationNumber: initialValues.borrowerIdentificationNumber,
        identificationType: initialValues.borrowerIdentificationType,
        name: getPropertyValue(initialValues.borrowerProperties, "name") || "",
        surname:
          getPropertyValue(initialValues.borrowerProperties, "surname") || "",
        Leases: parseFloat(
          getPropertyValue(initialValues.borrowerProperties, "Leases") || "0",
        ),
        Dividends: parseFloat(
          getPropertyValue(initialValues.borrowerProperties, "Dividends") ||
            "0",
        ),
        FinancialIncome: parseFloat(
          getPropertyValue(
            initialValues.borrowerProperties,
            "FinancialIncome",
          ) || "0",
        ),
        PeriodicSalary: parseFloat(
          getPropertyValue(
            initialValues.borrowerProperties,
            "PeriodicSalary",
          ) || "0",
        ),
        OtherNonSalaryEmoluments: parseFloat(
          getPropertyValue(
            initialValues.borrowerProperties,
            "OtherNonSalaryEmoluments",
          ) || "0",
        ),
        PensionAllowances: parseFloat(
          getPropertyValue(
            initialValues.borrowerProperties,
            "PensionAllowances",
          ) || "0",
        ),
        PersonalBusinessUtilities: parseFloat(
          getPropertyValue(
            initialValues.borrowerProperties,
            "PersonalBusinessUtilities",
          ) || "0",
        ),
        ProfessionalFees: parseFloat(
          getPropertyValue(
            initialValues.borrowerProperties,
            "ProfessionalFees",
          ) || "0",
        ),
      });
    }
  }, [initialValues]);

  const convertToPropertyArray = (
    income: IIncomeSources,
  ): IBorrowerProperty[] => {
    return Object.entries(income).map(([key, value]) => ({
      propertyName: key,
      propertyValue: String(value),
    }));
  };

  const mergeProperties = (
    original: IBorrowerProperty[],
    updates: IBorrowerProperty[],
  ): IBorrowerProperty[] => {
    const result: IBorrowerProperty[] = [];

    const duplicates = ["FinancialObligation"];
    const seen = new Map<string, IBorrowerProperty>();

    original.forEach((prop) => {
      if (duplicates.includes(prop.propertyName)) {
        result.push(prop);
      } else {
        seen.set(prop.propertyName, prop);
      }
    });

    updates.forEach((prop) => {
      if (duplicates.includes(prop.propertyName)) {
        result.push(prop);
      } else {
        seen.set(prop.propertyName, prop);
      }
    });

    return [...result, ...Array.from(seen.values())];
  };

  const handleSave = () => {
    if (!initialValues || !incomeData) return;

    const updatedProps = convertToPropertyArray(editedIncomeData ?? incomeData);

    const updatedBorrower: IBorrower = {
      ...initialValues,
      borrowerProperties: mergeProperties(
        initialValues.borrowerProperties,
        updatedProps,
      ),
    };

    onUpdate?.(updatedBorrower);
    handleFlag();
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
