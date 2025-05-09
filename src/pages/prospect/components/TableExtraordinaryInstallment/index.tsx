import { useEffect, useState } from "react";
import localforage from "localforage";
import { Text, SkeletonLine, useMediaQuery } from "@inubekit/inubekit";
import {
  Pagination,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@inubekit/table";

import { ActionMobile } from "@components/feedback/ActionMobile";
import { ListModal } from "@components/modals/ListModal";
import { EditSeriesModal } from "@components/modals/EditSeriesModal";
import { extraordinaryInstallmentMock } from "@mocks/prospect/extraordinaryInstallment.mock";
import { formatPrimaryDate } from "@utils/formatData/date";

import { Detail } from "./Detail";
import {
  headersTableExtraordinaryInstallment,
  rowsVisbleMobile,
  rowsActions,
  dataTableExtraordinaryInstallment,
} from "./config";

export interface TableExtraordinaryInstallmentProps {
  [key: string]: React.ReactNode;
  refreshKey?: number;
}

const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const pageLength = 5;
  const totalRecords = extraordinaryInstallmentMock.length;
  const totalPages = Math.ceil(totalRecords / pageLength);
  const handleStartPage = () => setCurrentPage(0);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const handleEndPage = () => setCurrentPage(totalPages - 1);

  const firstEntryInPage = currentPage * pageLength;
  const lastEntryInPage = Math.min(firstEntryInPage + pageLength, totalRecords);

  const currentData = extraordinaryInstallmentMock.slice(
    firstEntryInPage,
    lastEntryInPage,
  );

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
    currentData,
  };
};

export const TableExtraordinaryInstallment = (
  props: TableExtraordinaryInstallmentProps,
) => {
  const { refreshKey } = props;

  const headers = headersTableExtraordinaryInstallment;

  const [extraDebtors, setExtraDebtors] = useState<
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

  setTimeout(() => {
    setLoading(false);
  }, 500);

  const isMobile = useMediaQuery("(max-width:880px)");

  const visbleHeaders = isMobile
    ? headers.filter((header) => rowsVisbleMobile.includes(header.key))
    : headers;
  const visbleActions = isMobile
    ? rowsActions.filter((action) => rowsVisbleMobile.includes(action.key))
    : rowsActions;

  const {
    totalRecords,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    firstEntryInPage,
    lastEntryInPage,
  } = usePagination();

  useEffect(() => {
    const loadExtraDebtors = async () => {
      const storedData =
        (await localforage.getItem<TableExtraordinaryInstallmentProps[]>(
          "extraordinary_installments",
        )) || [];
      setExtraDebtors(storedData);
    };

    loadExtraDebtors();
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
    try {
      const updatedDebtors = extraDebtors.filter((debtor) => debtor.id !== id);
      setExtraDebtors(updatedDebtors);

      await localforage.setItem("extraordinary_installments", updatedDebtors);

      console.log(`Debtor with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete debtor:", error);
    }
  };

  const handleUpdate = async (
    updatedDebtor: TableExtraordinaryInstallmentProps,
  ) => {
    try {
      const updatedDebtors = extraDebtors.map((debtor) =>
        debtor.id === updatedDebtor.id ? updatedDebtor : debtor,
      );
      setExtraDebtors(updatedDebtors);
      await localforage.setItem("extraordinary_installments", updatedDebtors);
      setIsOpenModalEdit(false);
    } catch (error) {
      console.error("Error updating debtor:", error);
    }
  };

  return (
    <Table>
      <Thead>
        <Tr>
          {!loading &&
            visbleHeaders.map((header) => (
              <Th key={header.key} align="left">
                {header.label}
              </Th>
            ))}
          {!loading &&
            visbleActions &&
            visbleActions.length > 0 &&
            visbleActions.map((action) => (
              <Th key={action.key} action>
                {action.label}
              </Th>
            ))}
          {loading &&
            visbleHeaders.map((header) => (
              <Td key={header.key} align="left" type="custom">
                <SkeletonLine />
              </Td>
            ))}
          {loading &&
            visbleActions.map((action) => (
              <Td key={action.key} type="custom">
                <SkeletonLine />
              </Td>
            ))}
        </Tr>
      </Thead>
      <Tbody>
        {loading && (
          <Tr>
            <Td
              colSpan={visbleHeaders.length + visbleActions.length}
              align="center"
              type="custom"
            >
              <SkeletonLine />
            </Td>
          </Tr>
        )}
        {!loading &&
          extraDebtors &&
          extraDebtors.length > 0 &&
          extraDebtors.map((row, indx) => (
            <Tr key={indx} zebra={indx % 2 !== 0}>
              {visbleHeaders.map((header) => (
                <Td key={header.key} align="left">
                  {(() => {
                    if (header.key === "datePayment") {
                      return formatPrimaryDate(
                        new Date(row[header.key] as string),
                      );
                    }
                    if (header.mask) {
                      return header.mask(row[header.key] as string | number);
                    }
                    return row[header.key];
                  })()}
                </Td>
              ))}
              {visbleActions &&
                visbleActions.length > 0 &&
                visbleActions.map((action) => (
                  <Td key={action.key} type="custom">
                    {isMobile ? (
                      <ActionMobile
                        handleDelete={() => setIsOpenModalDelete(true)}
                        handleEdit={() => handleEdit(row)}
                      />
                    ) : (
                      <Detail
                        handleDelete={() => setIsOpenModalDelete(true)}
                        handleEdit={() => handleEdit(row)}
                      />
                    )}
                  </Td>
                ))}
            </Tr>
          ))}
        {!loading && extraDebtors.length === 0 && (
          <Tr>
            <Td
              colSpan={visbleHeaders.length + visbleActions.length}
              align="center"
              type="custom"
            >
              <Text
                size="large"
                type="label"
                appearance="gray"
                textAlign="center"
              >
                {dataTableExtraordinaryInstallment.noData}
              </Text>
            </Td>
          </Tr>
        )}
      </Tbody>
      {extraordinaryInstallmentMock.length > 0 && !loading && (
        <Tfoot>
          <Tr border="bottom">
            <Td
              colSpan={visbleHeaders.length + visbleActions.length}
              type="custom"
              align="center"
            >
              <Pagination
                firstEntryInPage={firstEntryInPage}
                lastEntryInPage={lastEntryInPage}
                totalRecords={totalRecords}
                handleStartPage={handleStartPage}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                handleEndPage={handleEndPage}
              />
            </Td>
          </Tr>
        </Tfoot>
      )}
      {isOpenModalDelete && (
        <ListModal
          title={dataTableExtraordinaryInstallment.deletion}
          handleClose={() => setIsOpenModalDelete(false)}
          handleSubmit={() => setIsOpenModalDelete(false)}
          onSubmit={() => {
            if (selectedDebtor) {
              handleDelete(selectedDebtor.id as string);
              setIsOpenModalDelete(false);
            }
          }}
          buttonLabel={dataTableExtraordinaryInstallment.delete}
          content={dataTableExtraordinaryInstallment.content}
          cancelButton={dataTableExtraordinaryInstallment.cancel}
        />
      )}
      {isOpenModalEdit && (
        <EditSeriesModal
          handleClose={() => setIsOpenModalEdit(false)}
          onSubmit={() => setIsOpenModalEdit(false)}
          onConfirm={async (updatedDebtor) => {
            await handleUpdate(updatedDebtor);
          }}
          initialValues={selectedDebtor}
        />
      )}
    </Table>
  );
};
