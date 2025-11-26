import { useState, useEffect, useContext, useRef } from "react";
import { useMediaQuery } from "@inubekit/inubekit";
import { FormikValues } from "formik";

import { AppContext } from "@context/AppContext";
import { currencyFormat } from "@utils/formatData/currency";
import { updateProspect } from "@services/prospect/updateProspect";
import { restoreFinancialObligationsByBorrowerId } from "@services/prospect/restoreFinancialObligationsByBorrowerId";

import {
  convertObligationsToProperties,
  headers,
  errorMessages,
} from "./config";
import {
  ITableFinancialObligationsProps,
  TableFinancialObligationsUI,
} from "./interface";
import { IProperty, IObligations } from "./types";

export const TableFinancialObligations = (
  props: ITableFinancialObligationsProps,
) => {
  const {
    refreshKey,
    initialValues,
    handleOnChange = () => {},
    setRefreshKey,
    onProspectUpdate,
    showActions,
    showButtons,
    formState,
    services = true,
    handleOnChangeExtraBorrowers = undefined,
    showOnlyEdit = false,
    showAddButton = true,
  } = props;
  const [loading] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedBorrower, setSelectedBorrower] =
    useState<ITableFinancialObligationsProps | null>(null);
  const [extraDebtors, setExtraDebtors] = useState<
    ITableFinancialObligationsProps[]
  >([]);
  const [selectedBorrowerIndex, setSelectedBorrowerIndex] = useState<number>(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const initialValuesSnapshot = useRef<FormikValues | null>(null);
  const initialObligationsSnapshot = useRef<IProperty[]>([]);

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const handleEdit = (debtor: ITableFinancialObligationsProps) => {
    let balance = "";
    let fee = "";

    if (typeof debtor.propertyValue === "string") {
      const values = debtor.propertyValue.split(",");
      balance = currencyFormat(Number(values[1]?.trim() || 0), false);
      fee = currencyFormat(Number(values[2]?.trim() || 0), false);
    }

    setSelectedBorrower({
      ...debtor,
      balance,
      fee,
    });
    setIsModalOpenEdit(true);
  };

  const normalizeObligations = (
    initial: FormikValues | undefined,
  ): IObligations[] => {
    if (!initial) return [];
    if (Array.isArray(initial)) return initial as IObligations[];
    if (Array.isArray(initial.obligations))
      return initial.obligations as IObligations[];
    if (Array.isArray(initial.obligations?.obligations))
      return initial.obligations.obligations as IObligations[];
    return [];
  };

  const isMobile = useMediaQuery("(max-width:880px)");

  const visibleHeaders = isMobile
    ? headers.filter(
        (header) =>
          ["type", "balance", "actions"].includes(header.key) &&
          (showActions || header.key !== "actions"),
      )
    : headers.filter((header) => showActions || header.key !== "actions");

  useEffect(() => {
    const data = Array.isArray(initialValues) ? initialValues : [initialValues];
    if (data && data.length > 0) {
      const borrowerList = Array.isArray(data[0]?.borrowers)
        ? data[0]?.borrowers
        : data;

      const financialObligationsFromProps =
        borrowerList?.[0]?.borrowerProperties?.filter(
          (prop: IProperty) => prop.propertyName === "FinancialObligation",
        ) || [];

      const getObligationsFromInitialValues = (
        initial: FormikValues | undefined,
      ): IObligations[] => {
        if (!initial) return [];

        if (Array.isArray(initial)) {
          return initial;
        }

        if (Array.isArray(initial?.obligations)) {
          return initial.obligations as IObligations[];
        }

        if (Array.isArray(initial?.obligations?.obligations)) {
          return initial.obligations.obligations as IObligations[];
        }

        return [];
      };

      const obligations = getObligationsFromInitialValues(initialValues);

      const obligationsConverted = Array.isArray(obligations)
        ? convertObligationsToProperties(obligations)
        : [];

      setExtraDebtors([
        ...financialObligationsFromProps,
        ...obligationsConverted,
      ]);
    } else {
      if (initialValues) {
        initialValues.obligations = {
          obligations: [],
        };
      }
      setExtraDebtors([]);
    }
  }, [refreshKey, initialValues]);

  useEffect(() => {
    if (initialValues && !initialValuesSnapshot.current) {
      initialValuesSnapshot.current = JSON.parse(JSON.stringify(initialValues));

      const data = Array.isArray(initialValues)
        ? initialValues
        : [initialValues];
      if (data && data.length > 0) {
        const borrowerList = Array.isArray(data[0]?.borrowers)
          ? data[0]?.borrowers
          : data;

        const financialObligations =
          borrowerList?.[0]?.borrowerProperties?.filter(
            (prop: IProperty) => prop.propertyName === "FinancialObligation",
          ) || [];

        initialObligationsSnapshot.current = JSON.parse(
          JSON.stringify(financialObligations),
        );
      }
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (services) {
      const borrowers = initialValues?.[0]?.borrowers || [];
      const selectedBorrower = borrowers[selectedBorrowerIndex];

      const updatedProperties = selectedBorrower.borrowerProperties.filter(
        (prop: IProperty) =>
          !(
            prop.propertyName === "FinancialObligation" &&
            prop.propertyValue === id
          ),
      );

      const updatedBorrower = {
        ...selectedBorrower,
        borrowerProperties: updatedProperties,
      };

      const updatedBorrowers = [...borrowers];
      updatedBorrowers[selectedBorrowerIndex] = updatedBorrower;

      const updatedInitialValues = {
        ...initialValues?.[0],
        borrowers: updatedBorrowers,
      };

      try {
        await updateProspect(
          businessUnitPublicCode,
          businessManagerCode,
          updatedInitialValues,
        );
      } catch (error) {
        setShowErrorModal(true);
        setMessageError(`${error}`);
      }
      setRefreshKey?.((prev) => prev + 1);
      onProspectUpdate?.();
    } else {
      try {
        const obligationNumberFromRow =
          typeof id === "string" ? id.split(",")[5]?.trim() : undefined;

        if (!obligationNumberFromRow) return;

        const currentObligations = normalizeObligations(initialValues);

        const updatedObligations = currentObligations.filter(
          (obligation: IObligations) =>
            String(obligation.obligationNumber) !== obligationNumberFromRow,
        );

        if (Array.isArray(initialValues)) {
          handleOnChange(updatedObligations);
        } else if (initialValues && typeof initialValues === "object") {
          const updatedInitialValues = {
            ...initialValues,
            obligations: updatedObligations,
          };
          handleOnChange(updatedInitialValues);
        } else {
          handleOnChange(updatedObligations);
        }

        setRefreshKey?.((prev) => prev + 1);
      } catch (error) {
        setShowErrorModal(true);
        setMessageError(`${error}`);
      }
    }
  };

  const handleUpdate = async (
    updatedDebtor: ITableFinancialObligationsProps,
  ) => {
    if (services) {
      try {
        const borrowers = initialValues?.[0]?.borrowers || [];
        const currentBorrower = borrowers[selectedBorrowerIndex];

        const obligationIndex = currentBorrower.borrowerProperties.findIndex(
          (prop: IProperty) =>
            prop.propertyName === "FinancialObligation" &&
            prop.propertyValue === selectedBorrower?.propertyValue,
        );

        if (obligationIndex === -1) return;

        const originalValues = selectedBorrower?.propertyValue
          ? selectedBorrower.propertyValue
              .split(",")
              .map((value: string) => value.trim())
          : [];

        originalValues[1] = updatedDebtor.balance || originalValues[1];
        originalValues[2] = updatedDebtor.fee || originalValues[2];

        const newPropertyValue = originalValues.join(", ");

        const updatedProperties = [...currentBorrower.borrowerProperties];
        updatedProperties[obligationIndex] = {
          ...updatedProperties[obligationIndex],
          propertyValue: newPropertyValue,
        };

        const updatedBorrower = {
          ...currentBorrower,
          borrowerProperties: updatedProperties,
        };

        const updatedBorrowers = [...borrowers];
        updatedBorrowers[selectedBorrowerIndex] = updatedBorrower;

        const updatedInitialValues = {
          ...initialValues?.[0],
          borrowers: updatedBorrowers,
        };

        await updateProspect(
          businessUnitPublicCode,
          businessManagerCode,
          updatedInitialValues,
        );
        setRefreshKey?.((prev) => prev + 1);
        setIsModalOpenEdit(false);
        onProspectUpdate?.();
      } catch (error) {
        setShowErrorModal(true);
        setMessageError(`${errorMessages.updateMessage}  ${error}`);
      }
    } else {
      try {
        const currentObligations = normalizeObligations(initialValues);

        const obligationNumber = updatedDebtor.propertyValue
          ?.split(",")[5]
          .trim();

        const obligationIndex = currentObligations.findIndex(
          (obligation: IObligations) =>
            obligation.obligationNumber === obligationNumber,
        );

        if (obligationIndex === -1) return;

        const updatedObligation = {
          ...currentObligations[obligationIndex],
          balanceObligationTotal:
            updatedDebtor.balance !== undefined && updatedDebtor.balance !== ""
              ? Number(updatedDebtor.balance)
              : currentObligations[obligationIndex].balanceObligationTotal,
          nextPaymentValueTotal:
            updatedDebtor.fee !== undefined && updatedDebtor.fee !== ""
              ? Number(updatedDebtor.fee)
              : currentObligations[obligationIndex].nextPaymentValueTotal,
        } as IObligations;

        const updatedObligations = [...currentObligations];
        updatedObligations[obligationIndex] = updatedObligation;

        if (Array.isArray(initialValues)) {
          handleOnChange(updatedObligations);
        } else if (initialValues && typeof initialValues === "object") {
          const updatedInitialValues = {
            ...initialValues,
            obligations: updatedObligations,
          };
          handleOnChange(updatedInitialValues);
        } else {
          handleOnChange(updatedObligations);
        }

        setRefreshKey?.((prev) => prev + 1);
        setIsModalOpenEdit(false);

        if (handleOnChangeExtraBorrowers !== undefined)
          handleOnChangeExtraBorrowers(updatedObligations);
      } catch (error) {
        setShowErrorModal(true);
        setMessageError(`${error}`);
      }
    }
  };

  useEffect(() => {
    if (
      Array.isArray(initialValues?.[0]?.borrowers) &&
      initialValues[0].borrowers.length > 0
    ) {
      setSelectedBorrowerIndex(0);
    }
  }, [initialValues]);

  const dataInformation =
    (initialValues?.[0]?.borrowers?.[
      selectedBorrowerIndex
    ]?.borrowerProperties?.filter(
      (prop: IProperty) => prop.propertyName === "FinancialObligation",
    ) ??
      extraDebtors) ||
    [];

  const handleRestore = async () => {
    if (!services) {
      if (initialValuesSnapshot.current) {
        handleOnChange(
          JSON.parse(JSON.stringify(initialValuesSnapshot.current)),
        );
        setRefreshKey?.((prev) => prev + 1);
      }
      return;
    }

    try {
      const borrower =
        initialValuesSnapshot.current?.[0]?.borrowers?.[selectedBorrowerIndex];

      if (!borrower) {
        setShowErrorModal(true);
        setMessageError("No se encontró el deudor para restaurar");
        return;
      }

      await restoreFinancialObligationsByBorrowerId(
        businessUnitPublicCode,
        borrower.borrowerIdentificationNumber || "",
        initialValuesSnapshot.current?.[0]?.prospectCode || "",
        "Restore financial obligations",
      );

      setRefreshKey?.((prev) => prev + 1);
      onProspectUpdate?.();
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(`Error al restaurar: ${error}`);
    }
  };

  return (
    <TableFinancialObligationsUI
      initialValuesModalDataProspect={initialValues}
      dataInformation={dataInformation}
      extraDebtors={extraDebtors}
      loading={loading}
      visibleHeaders={visibleHeaders}
      isMobile={isMobile}
      selectedBorrower={selectedBorrower}
      isModalOpenEdit={isModalOpenEdit}
      businessManagerCode={businessManagerCode}
      setIsModalOpenEdit={setIsModalOpenEdit}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleUpdate={handleUpdate}
      showButtons={showButtons}
      formState={formState}
      services={services}
      initialValues={initialValues as IObligations}
      handleOnChange={handleOnChange}
      setRefreshKey={setRefreshKey}
      setSelectedBorrower={setSelectedBorrower}
      selectedBorrowerIndex={selectedBorrowerIndex}
      businessUnitPublicCode={businessUnitPublicCode}
      setSelectedBorrowerIndex={setSelectedBorrowerIndex}
      onProspectUpdate={onProspectUpdate}
      setShowErrorModal={setShowErrorModal}
      setMessageError={setMessageError}
      showErrorModal={showErrorModal}
      messageError={messageError}
      handleRestore={handleRestore}
      handleOnChangeExtraBorrowers={handleOnChangeExtraBorrowers}
      showOnlyEdit={showOnlyEdit}
      showAddButton={showAddButton}
    />
  );
};
