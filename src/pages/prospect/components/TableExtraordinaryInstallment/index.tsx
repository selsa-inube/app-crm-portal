import { useEffect, useState } from "react";
import { useMediaQuery } from "@inubekit/inubekit";

import { IProspect } from "@services/prospects/types";
import { IExtraordinaryInstallments } from "@services/iProspect/saveExtraordinaryInstallments/types";

import {
  headersTableExtraordinaryInstallment,
  rowsVisbleMobile,
  rowsActions,
} from "./config";
import { TableExtraordinaryInstallmentUI } from "./interface";

export interface TableExtraordinaryInstallmentProps {
  [key: string]: unknown;
  sentData?: IExtraordinaryInstallments | null;
  prospectData?: IProspect;
  refreshKey?: number;
  id?: string;
  setSentData?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallments | null>
  >;
  handleClose?: () => void;
  businessUnitPublicCode?: string;
}

const usePagination = (data: TableExtraordinaryInstallmentProps[] = []) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageLength = 5;
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / pageLength);

  const handleStartPage = () => setCurrentPage(0);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const handleEndPage = () => setCurrentPage(totalPages - 1);

  const firstEntryInPage = currentPage * pageLength;
  const lastEntryInPage = Math.min(firstEntryInPage + pageLength, totalRecords);

  const currentData = data.slice(firstEntryInPage, lastEntryInPage);

  const paddingCount = pageLength - currentData.length;
  const paddingItems = Array.from({
    length: paddingCount > 0 ? paddingCount : 0,
  }).map((_, i) => ({
    __isPadding: true,
    id: `padding-${i}`,
  }));

  const paddedCurrentData = [...currentData, ...paddingItems];
  return {
    currentPage,
    totalRecords,
    totalPages,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    firstEntryInPage,
    lastEntryInPage,
    paddedCurrentData,
  };
};

export const TableExtraordinaryInstallment = (
  props: TableExtraordinaryInstallmentProps,
) => {
  const {
    refreshKey,
    prospectData,
    setSentData,
    handleClose,
    businessUnitPublicCode,
  } = props;

  const headers = headersTableExtraordinaryInstallment;
  const [extraordinaryInstallments, setExtraordinaryInstallments] = useState<
    TableExtraordinaryInstallmentProps[]
  >([]);
  const [selectedDebtor, setSelectedDebtor] =
    useState<TableExtraordinaryInstallmentProps>({});

  const handleEdit = (debtor: TableExtraordinaryInstallmentProps) => {
    setSelectedDebtor(debtor);
    setIsOpenModalEdit(true);
  };
  const [loading, setLoading] = useState(true);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);

  const isMobile = useMediaQuery("(max-width:880px)");

  const visbleHeaders = isMobile
    ? headers.filter((header) => rowsVisbleMobile.includes(header.key))
    : headers;
  const visbleActions = isMobile
    ? rowsActions.filter((action) => rowsVisbleMobile.includes(action.key))
    : rowsActions;

  useEffect(() => {
    if (prospectData?.creditProducts) {
      const extraordinaryInstallmentsUpdate = prospectData.creditProducts
        .flatMap((product) =>
          Array.isArray(product.extraordinaryInstallments)
            ? product.extraordinaryInstallments.map((installment) => ({
                id: `${product.creditProductCode},${installment.installmentDate}`,
                datePayment: installment.installmentDate,
                value: installment.installmentAmount,
                paymentMethod: installment.paymentChannelAbbreviatedName,
              }))
            : [],
        )
        .reverse();
      setExtraordinaryInstallments(extraordinaryInstallmentsUpdate);
    }
    setLoading(false);
  }, [prospectData, refreshKey]);

  const handleDelete = async (
    id: string,
    updatedDebtor: TableExtraordinaryInstallmentProps,
  ) => {
    try {
      const updatedDebtors = extraordinaryInstallments.map((debtor) =>
        debtor.id === updatedDebtor.id ? updatedDebtor : debtor,
      );
      setExtraordinaryInstallments(updatedDebtors);
      console.log(`Debtor with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete debtor:", error);
    }
  };

  const handleUpdate = async (
    updatedDebtor: TableExtraordinaryInstallmentProps,
  ) => {
    try {
      const updatedDebtors = extraordinaryInstallments.map((debtor) =>
        debtor.id === updatedDebtor.id ? updatedDebtor : debtor,
      );
      setExtraordinaryInstallments(updatedDebtors);
      setIsOpenModalEdit(false);
    } catch (error) {
      console.error("Error updating debtor:", error);
    }
  };
  return (
    <TableExtraordinaryInstallmentUI
      loading={loading}
      visbleHeaders={visbleHeaders}
      visbleActions={visbleActions}
      extraordinaryInstallments={extraordinaryInstallments}
      isMobile={isMobile}
      selectedDebtor={selectedDebtor}
      isOpenModalDelete={isOpenModalDelete}
      isOpenModalEdit={isOpenModalEdit}
      setIsOpenModalDelete={setIsOpenModalDelete}
      setIsOpenModalEdit={setIsOpenModalEdit}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleUpdate={handleUpdate}
      usePagination={usePagination}
      setSentData={setSentData ?? (() => {})}
      handleClose={handleClose}
      prospectData={prospectData}
      setSelectedDebtor={setSelectedDebtor}
      businessUnitPublicCode={businessUnitPublicCode ?? ""}
    />
  );
};
