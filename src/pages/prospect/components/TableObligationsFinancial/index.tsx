import { useState, useEffect } from "react";
import localforage from "localforage";
import { useMediaQuery } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";

import { headers } from "./config";
import { TableFinancialObligationsUI } from "./interface";
export interface ITableFinancialObligationsProps {
  type?: string;
  id?: string;
  propertyValue?: string;
  balance?: string;
  fee?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues?: any;
  refreshKey?: number;
  showActions?: boolean;
  showOnlyEdit?: boolean;
  showButtons?: boolean;
}

export const TableFinancialObligations = (
  props: ITableFinancialObligationsProps,
) => {
  const { refreshKey, initialValues, showActions, showButtons } = props;
  const [loading, setLoading] = useState(true);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedDebtor, setSelectedDebtor] =
    useState<ITableFinancialObligationsProps | null>(null);
  const [extraDebtors, setExtraDebtors] = useState<
    ITableFinancialObligationsProps[]
  >([]);

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

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

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

      const dataFromInitialValues =
        borrowerList?.[0]?.borrowerProperties?.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (prop: any) => prop.propertyName === "FinancialObligation",
        ) || [];

      setExtraDebtors(dataFromInitialValues);
    } else {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prop: any) => prop.propertyName === "FinancialObligation",
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
    />
  );
};
