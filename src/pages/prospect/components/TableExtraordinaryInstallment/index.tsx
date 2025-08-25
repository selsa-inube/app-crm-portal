import { useEffect, useState } from "react";
import { useMediaQuery, useFlag } from "@inubekit/inubekit";

import {
  IExtraordinaryInstallments,
  IProspect,
} from "@services/prospect/types";
import { TextLabels } from "@components/modals/ExtraordinaryPaymentModal/config";

import { removeExtraordinaryInstallment } from "./utils";
import {
  headersTableExtraordinaryInstallment,
  rowsVisbleMobile,
  rowsActions,
} from "./config";
import { TableExtraordinaryInstallmentUI } from "./interface";

export interface TableExtraordinaryInstallmentProps {
  [key: string]: unknown | string | number;
  prospectData?: IProspect;
  refreshKey?: number;
  businessUnitPublicCode?: string;
  extraordinary?: TableExtraordinaryInstallmentProps[];
  service?: boolean;
  setSentData?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallments | null>
  >;
  handleClose?: () => void;
  handleDelete?: (id: string) => void;
  handleUpdate?: (updatedDebtor: TableExtraordinaryInstallmentProps) => void;
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
    businessUnitPublicCode,
    extraordinary,
    service = true,
    setSentData,
    handleClose,
    handleDelete,
    handleUpdate,
  } = props;

  const headers = headersTableExtraordinaryInstallment;
  const isMobile = useMediaQuery("(max-width:880px)");
  const visbleHeaders = isMobile
    ? headers.filter((header) => rowsVisbleMobile.includes(header.key))
    : headers;
  const visbleActions = isMobile
    ? rowsActions.filter((action) => rowsVisbleMobile.includes(action.key))
    : rowsActions;

  const [extraordinaryInstallments, setExtraordinaryInstallments] = useState<
    TableExtraordinaryInstallmentProps[]
  >([]);
  const [selectedDebtor, setSelectedDebtor] =
    useState<TableExtraordinaryInstallmentProps>({});
  const [loading, setLoading] = useState(true);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const paginationProps = usePagination(extraordinaryInstallments);
  const { addFlag } = useFlag();

  const itemIdentifiersForUpdate: IExtraordinaryInstallments = {
    creditProductCode: prospectData?.creditProducts[0].creditProductCode || "",
    extraordinaryInstallments:
      prospectData?.creditProducts[0]?.extraordinaryInstallments
        ?.filter((installment) => {
          const expectedId = `${prospectData?.creditProducts[0].creditProductCode},${installment.installmentDate},${installment.paymentChannelAbbreviatedName}`;
          return expectedId === selectedDebtor?.id;
        })
        ?.map((installment) => ({
          installmentDate:
            typeof installment.installmentDate === "string"
              ? installment.installmentDate
              : new Date(installment.installmentDate).toISOString(),
          installmentAmount: Number(installment.installmentAmount),
          paymentChannelAbbreviatedName: String(
            installment.paymentChannelAbbreviatedName,
          ),
        })) || [],
    prospectId: prospectData?.prospectId || "",
  };

  useEffect(() => {
    if (prospectData?.creditProducts) {
      const extraordinaryInstallmentsFlat = prospectData.creditProducts.flatMap(
        (product) =>
          Array.isArray(product.extraordinaryInstallments)
            ? product.extraordinaryInstallments.map((installment) => ({
                id: `${product.creditProductCode},${installment.installmentDate},${installment.paymentChannelAbbreviatedName}`,
                datePayment: installment.installmentDate,
                value: installment.installmentAmount,
                paymentMethod: installment.paymentChannelAbbreviatedName,
                creditProductCode: product.creditProductCode,
              }))
            : [],
      );
      const installmentsByUniqueKey = extraordinaryInstallmentsFlat.reduce(
        (
          installmentsAccumulator: Record<
            string,
            TableExtraordinaryInstallmentProps
          >,
          currentInstallment,
        ) => {
          const uniqueKey = `${currentInstallment.creditProductCode}_${currentInstallment.datePayment}_${currentInstallment.paymentMethod}`;

          if (installmentsAccumulator[uniqueKey]) {
            installmentsAccumulator[uniqueKey].value =
              (installmentsAccumulator[uniqueKey].value as number) +
              (currentInstallment.value as number);
          } else {
            installmentsAccumulator[uniqueKey] = { ...currentInstallment };
          }

          return installmentsAccumulator;
        },
        {},
      );

      const extraordinaryInstallmentsUpdate = Object.values(
        installmentsByUniqueKey,
      ).reverse() as TableExtraordinaryInstallmentProps[];

      setExtraordinaryInstallments(extraordinaryInstallmentsUpdate);
    }
    setLoading(false);
  }, [prospectData, refreshKey]);

  useEffect(() => {
    if (extraordinary && Array.isArray(extraordinary)) {
      setExtraordinaryInstallments(extraordinary);
      setLoading(false);
    }
  }, [extraordinary]);

  const handleUpdateData = async (
    updatedDebtor: TableExtraordinaryInstallmentProps,
  ) => {
    if (!service && typeof handleUpdate === "function") {
      handleUpdate(updatedDebtor);
      setIsOpenModalEdit(false);
      return;
    }
    try {
      const updatedDebtors = extraordinaryInstallments.map((debtor) =>
        debtor.id === updatedDebtor.id ? updatedDebtor : debtor,
      );
      setExtraordinaryInstallments(updatedDebtors);
      setIsOpenModalEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAction = async () => {
    if (handleDelete && selectedDebtor.id) {
      handleDelete(selectedDebtor.id as string);
      setIsOpenModalDelete(false);
    } else if (service) {
      try {
        await removeExtraordinaryInstallment(
          businessUnitPublicCode ?? "",
          itemIdentifiersForUpdate,
        );

        setSentData?.(itemIdentifiersForUpdate);
        setIsOpenModalDelete(false);
        handleClose?.();
      } catch (error: unknown) {
        const err = error as {
          message?: string;
          status?: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + (err?.message || "") + (err?.data?.description || "");

        addFlag({
          title: TextLabels.titleError,
          description,
          appearance: "danger",
          duration: 5000,
        });
      }
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
      businessUnitPublicCode={businessUnitPublicCode ?? ""}
      prospectData={prospectData}
      setIsOpenModalDelete={setIsOpenModalDelete}
      setIsOpenModalEdit={setIsOpenModalEdit}
      handleUpdate={handleUpdateData}
      usePagination={paginationProps}
      setSentData={setSentData ?? (() => {})}
      handleClose={handleClose}
      setSelectedDebtor={setSelectedDebtor}
      handleDelete={handleDelete}
      service={service}
      itemIdentifiersForUpdate={itemIdentifiersForUpdate}
      handleDeleteAction={handleDeleteAction}
    />
  );
};
