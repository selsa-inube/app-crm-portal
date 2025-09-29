import { useEffect, useState } from "react";
import { Stack, Tabs, useFlag } from "@inubekit/inubekit";
import { FormikValues } from "formik";

import { BaseModal } from "@components/modals/baseModal";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { getPropertyValue } from "@utils/mappingData/mappings";
import { IBorrower } from "@services/prospect/types";
import { IIncomeSources } from "@services/creditLimit/types";

import { dataEditDebtor, dataTabs, dataReport } from "./config";
import { DataDebtor } from "./dataDebtor";
import {
  transformFinancialObligations,
  updateBorrowerPropertiesWithNewObligations,
  updateBorrowerPropertiesWithNewIncome,
} from "./utils";
import { IObligations } from "../../TableObligationsFinancial/types";

interface IDebtorEditModalProps {
  isMobile: boolean;
  initialValues: IBorrower;
  currentBorrowerIndex?: number | null;
  publicCode?: string;
  businessUnitPublicCode: string;
  handleClose: () => void;
  onSave?: () => void;
  onUpdate?: (updatedBorrower: IBorrower, isSave?: boolean) => void;
  businessUnit?: string;
  businessUnitId?: string;
}

export function DebtorEditModal(props: IDebtorEditModalProps) {
  const {
    isMobile,
    initialValues,
    publicCode,
    businessUnitPublicCode,
    handleClose,
    onUpdate,
  } = props;
  const [currentTab, setCurrentTab] = useState(dataTabs[0].id);
  const [editedBorrower, setEditedBorrower] =
    useState<IBorrower>(initialValues);

  const [incomeData, setIncomeData] = useState<IIncomeSources | undefined>(
    undefined,
  );

  const [isModified, setIsModified] = useState(false);

  const { addFlag } = useFlag();

  useEffect(() => {
    setEditedBorrower(initialValues);
  }, [initialValues]);

  const handleFlag = () => {
    addFlag({
      title: `${dataReport.titleAdd}`,
      description: `${dataReport.descriptionFlagAdd}`,
      appearance: "success",
      duration: 5000,
    });
  };

  const handleDebtorDataChange = (fieldName: string, value: string) => {
    const propertyMap: { [key: string]: string } = {
      email: "email",
      phone: "phone_number",
      relation: "relationship",
      name: "name",
      surname: "surname",
    };
    const propertyToUpdate = propertyMap[fieldName];

    if (!propertyToUpdate) {
      return;
    }

    setEditedBorrower((prevState) => {
      const newProperties = prevState.borrowerProperties.map((prop) => {
        if (prop.propertyName === propertyToUpdate) {
          return { ...prop, propertyValue: value };
        }
        return prop;
      });

      const updatedBorrower = {
        ...prevState,
        borrowerProperties: newProperties,
      };

      if (fieldName === "name" || fieldName === "surname") {
        const newName = getPropertyValue(newProperties, "name") || "";
        const newSurname = getPropertyValue(newProperties, "surname") || "";
        updatedBorrower.borrowerName = `${newName} ${newSurname}`.trim();
      }

      return updatedBorrower;
    });

    setIsModified(true);
  };

  useEffect(() => {
    if (initialValues) {
      setIncomeData({
        identificationNumber: initialValues.borrowerIdentificationNumber,
        identificationType: initialValues.borrowerIdentificationType,
        name: initialValues.borrowerName,
        surname: "",
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

  const handleSave = () => {
    if (!initialValues || !incomeData || onUpdate === undefined) return;

    onUpdate(editedBorrower, true);

    handleFlag();
  };

  const syncObligations = (updatedObligationsList: IObligations[]) => {
    const updatedProperties = updateBorrowerPropertiesWithNewObligations(
      updatedObligationsList,
      editedBorrower.borrowerProperties,
    );

    const updatedBorrower: IBorrower = {
      ...editedBorrower,
      borrowerProperties: updatedProperties,
    };

    setEditedBorrower(updatedBorrower);

    if (onUpdate) {
      onUpdate(updatedBorrower);
    }

    setIsModified(true);
  };

  const handleEditOrDeleteObligation = (newObligations: IObligations[]) => {
    syncObligations(newObligations);
  };

  const handleAddObligation = (values: FormikValues) => {
    if (Array.isArray(values)) {
      syncObligations(values as IObligations[]);
    }
  };

  const handleIncomeChange = (newIncome: IIncomeSources) => {
    const updatedProperties = updateBorrowerPropertiesWithNewIncome(
      newIncome,
      editedBorrower.borrowerProperties,
    );

    const updatedBorrower: IBorrower = {
      ...editedBorrower,
      borrowerProperties: updatedProperties,
    };

    setEditedBorrower(updatedBorrower);
    setIsModified(true);
  };

  return (
    <BaseModal
      title={dataEditDebtor.title}
      nextButton={dataEditDebtor.save}
      backButton={dataEditDebtor.close}
      handleNext={handleSave}
      handleBack={handleClose}
      handleClose={handleClose}
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
        {currentTab === "data" && (
          <DataDebtor
            data={editedBorrower}
            onDataChange={handleDebtorDataChange}
          />
        )}
        {currentTab === "sources" && incomeData && (
          <SourceIncome
            data={incomeData}
            showEdit={false}
            onDataChange={(newIncome) => {
              setIsModified(true);
              handleIncomeChange(newIncome);
            }}
            publicCode={publicCode}
            businessUnitPublicCode={businessUnitPublicCode}
          />
        )}
        {currentTab === "obligations" && (
          <TableFinancialObligations
            initialValues={transformFinancialObligations(
              editedBorrower.borrowerProperties,
            )}
            showActions={true}
            services={false}
            handleOnChangeExtraBorrowers={handleEditOrDeleteObligation}
            handleOnChange={handleAddObligation}
          />
        )}
      </Stack>
    </BaseModal>
  );
}
