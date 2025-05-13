import {
  Pagination,
  SkeletonLine,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@inubekit/inubekit";

import { ActionMobile } from "@components/feedback/ActionMobile";
import { ListModal } from "@components/modals/ListModal";
import { EditSeriesModal } from "@components/modals/EditSeriesModal";
import { formatPrimaryDate } from "@utils/formatData/date";

import { TableExtraordinaryInstallmentProps } from ".";
import { dataTableExtraordinaryInstallment } from "./config";
import { Detail } from "./Detail";

interface ITableExtraordinaryInstallmentProps {
  loading: boolean;
  visbleHeaders: {
    key: string;
    label: string;
    mask?: (value: string | number) => string | number;
  }[];
  visbleActions: { key: string; label: string }[];
  extraordinaryInstallments: TableExtraordinaryInstallmentProps[];
  isMobile: boolean;
  selectedDebtor: TableExtraordinaryInstallmentProps;
  isOpenModalDelete: boolean;
  isOpenModalEdit: boolean;
  setIsOpenModalDelete: (value: boolean) => void;
  setIsOpenModalEdit: (value: boolean) => void;
  handleEdit: (row: TableExtraordinaryInstallmentProps) => void;
  handleDelete: (id: string) => void;
  handleUpdate: (
    updatedDebtor: TableExtraordinaryInstallmentProps,
  ) => Promise<void>;
  usePagination: (data: TableExtraordinaryInstallmentProps[]) => {
    totalRecords: number;
    handleStartPage: () => void;
    handlePrevPage: () => void;
    handleNextPage: () => void;
    handleEndPage: () => void;
    firstEntryInPage: number;
    lastEntryInPage: number;
  };
}

export function TableExtraordinaryInstallmentUI(
  props: ITableExtraordinaryInstallmentProps,
) {
  const {
    loading,
    visbleHeaders,
    visbleActions,
    extraordinaryInstallments,
    isMobile,
    selectedDebtor,
    isOpenModalDelete,
    isOpenModalEdit,
    setIsOpenModalDelete,
    setIsOpenModalEdit,
    handleEdit,
    handleDelete,
    handleUpdate,
    usePagination,
  } = props;

  const {
    totalRecords,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    firstEntryInPage,
    lastEntryInPage,
  } = usePagination(extraordinaryInstallments);

  return (
    <Table>
      <Thead>
        <Tr>
          {!loading &&
            visbleHeaders.map((header) => (
              <Th key={header.key} align="center">
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
          extraordinaryInstallments &&
          extraordinaryInstallments.length > 0 &&
          extraordinaryInstallments.map((row, indx) => (
            <Tr key={indx} zebra={indx % 2 !== 0}>
              {visbleHeaders.map((header) => (
                <Td key={header.key} align="left">
                  {header.key === "datePayment"
                    ? formatPrimaryDate(new Date(row[header.key] as string))
                    : header.mask
                      ? header.mask(row[header.key] as string | number)
                      : (row[header.key] as React.ReactNode)}
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
        {!loading && extraordinaryInstallments.length === 0 && (
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
      {extraordinaryInstallments.length > 0 && !loading && (
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
}
