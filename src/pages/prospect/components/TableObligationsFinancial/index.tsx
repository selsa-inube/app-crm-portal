import { useState, useEffect } from "react";
import localforage from "localforage";
import { useMediaQuery } from "@inubekit/inubekit";
import { FormikValues, useFormik } from "formik";

import { currencyFormat } from "@utils/formatData/currency";
import { IObligations } from "@services/creditRequest/types";

import { convertObligationsToProperties, headers } from "./config";
import {
  ITableFinancialObligationsProps,
  TableFinancialObligationsUI,
} from "./interface";
import { IProperty } from "./types";

export const TableFinancialObligations = (
  props: ITableFinancialObligationsProps,
) => {
  const {
    refreshKey,
    initialValues,
    handleOnChange = () => {},
    setRefreshKey,
    showActions,
    showButtons,
    formState,
  } = props;
  const [loading] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedDebtor, setSelectedDebtor] =
    useState<ITableFinancialObligationsProps | null>(null);
  const [extraDebtors, setExtraDebtors] = useState<
    ITableFinancialObligationsProps[]
  >([]);

  const formik = useFormik<{
    obligations: IObligations | null;
  }>({
    initialValues: {
      obligations: initialValues as IObligations,
    },
    onSubmit: () => {},
  });

  useEffect(() => {
    handleOnChange(formik.values);
  }, []);

  const handleEdit = (debtor: ITableFinancialObligationsProps) => {
    let balance = "";
    let fee = "";

    if (typeof debtor.propertyValue === "string") {
      const values = debtor.propertyValue.split(",");
      balance = currencyFormat(Number(values[1]?.trim() || 0), false);
      fee = currencyFormat(Number(values[2]?.trim() || 0), false);
    }

    setSelectedDebtor({
      ...debtor,
      balance,
      fee,
    });
    setIsModalOpenEdit(true);
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

      function getDeepestObligations(obj: FormikValues) {
        let current = obj;
        while (current && typeof current.obligations === "object") {
          current = current.obligations;
        }
        return current;
      }

      if (initialValues && !initialValues.obligations) {
        initialValues.obligations = {
          obligations: [],
        };
      } else if (
        initialValues?.obligations &&
        !initialValues.obligations.obligations
      ) {
        initialValues.obligations.obligations = [];
      }
      const obligations = getDeepestObligations(initialValues as FormikValues);

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

  const handleDelete = async (id: string) => {
    try {
      const updatedDebtors = extraDebtors.filter((debtor) => debtor.id !== id);
      setExtraDebtors(updatedDebtors);

      await localforage.setItem("financial_obligation", updatedDebtors);

      console.log(`Debtor with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete debtor:", error);
    }
  };

  const handleUpdate = async (
    updatedDebtor: ITableFinancialObligationsProps,
  ) => {
    try {
      const updatedDebtors = extraDebtors.map((debtor) =>
        debtor.id === updatedDebtor.id ? updatedDebtor : debtor,
      );
      setExtraDebtors(updatedDebtors);
      await localforage.setItem("financial_obligation", updatedDebtors);
      setIsModalOpenEdit(false);
    } catch (error) {
      console.error("Error updating debtor:", error);
    }
  };
  const dataInformation =
    (initialValues?.[0]?.borrowers?.[0]?.borrowerProperties?.filter(
      (prop: IProperty) => prop.propertyName === "FinancialObligation",
    ) ??
      extraDebtors) ||
    [];

  return (
    <TableFinancialObligationsUI
      dataInformation={dataInformation}
      extraDebtors={extraDebtors}
      loading={loading}
      visibleHeaders={visibleHeaders}
      isMobile={isMobile}
      selectedDebtor={selectedDebtor}
      isModalOpenEdit={isModalOpenEdit}
      setIsModalOpenEdit={setIsModalOpenEdit}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleUpdate={handleUpdate}
      showButtons={showButtons}
      formState={formState}
      initialValues={initialValues as IObligations}
      handleOnChange={handleOnChange}
      setRefreshKey={setRefreshKey}
    />
  );
};
