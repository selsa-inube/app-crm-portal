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
import { DeleteModal } from "@components/modals/DeleteModal";
import { ErrorModal } from "@components/modals/ErrorModal";
import { formatPrimaryDate } from "@utils/formatData/date";
import {
  IExtraordinaryInstallments,
  IProspect,
} from "@services/prospect/types";

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
  prospectData: IProspect | undefined;
  businessUnitPublicCode: string;
  service: boolean;
  showErrorModal: boolean;
  messageError: string;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenModalDelete: (value: boolean) => void;
  setIsOpenModalEdit: (value: boolean) => void;
  setInstallmentState: React.Dispatch<
    React.SetStateAction<{
      installmentAmount: number;
      installmentDate: string;
      paymentChannelAbbreviatedName: string;
    }>
  >;
  handleUpdate: (
    updatedDebtor: TableExtraordinaryInstallmentProps,
  ) => Promise<void>;
  usePagination: {
    totalRecords: number;
    handleStartPage: () => void;
    handlePrevPage: () => void;
    handleNextPage: () => void;
    handleEndPage: () => void;
    firstEntryInPage: number;
    lastEntryInPage: number;
    paddedCurrentData: TableExtraordinaryInstallmentProps[];
  };
  setSentData?:
    | React.Dispatch<React.SetStateAction<IExtraordinaryInstallments | null>>
    | undefined;
  handleClose?: (() => void) | undefined;
  setSelectedDebtor: React.Dispatch<
    React.SetStateAction<TableExtraordinaryInstallmentProps>
  >;
  handleDelete?: (id: string) => void;
  itemIdentifiersForUpdate: IExtraordinaryInstallments;
  handleDeleteAction: () => Promise<void>;
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
    isOpenModalDelete,
    usePagination,
    showErrorModal,
    messageError,
    setShowErrorModal,
    setIsOpenModalDelete,
    setIsOpenModalEdit,
    setSelectedDebtor,
    handleDeleteAction,
    setInstallmentState,
  } = props;

  const {
    totalRecords,
    firstEntryInPage,
    lastEntryInPage,
    paddedCurrentData,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
  } = usePagination;

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
          paddedCurrentData.filter(
            (row: TableExtraordinaryInstallmentProps) => !row.__isPadding,
          ).length > 0 &&
          paddedCurrentData
            .filter(
              (row: TableExtraordinaryInstallmentProps) => !row.__isPadding,
            )
            .map((row: TableExtraordinaryInstallmentProps, index: number) => (
              <Tr key={index} zebra={index % 2 !== 0}>
                {visbleHeaders.map((header) => {
                  const raw =
                    row[header.key as keyof TableExtraordinaryInstallmentProps];
                  const value =
                    header.key === "datePayment"
                      ? formatPrimaryDate(new Date(raw as string))
                      : header.mask
                        ? header.mask(raw as string | number)
                        : raw;

                  return (
                    <Td key={header.key} align="left">
                      {value?.toString() ?? ""}
                    </Td>
                  );
                })}

                {visbleActions.map((action) => (
                  <Td key={action.key} type="custom">
                    {isMobile ? (
                      <ActionMobile
                        handleDelete={() => {
                          setSelectedDebtor(row);
                          setIsOpenModalDelete(true);
                        }}
                        handleView={() => {}}
                        handleEdit={() => {
                          setSelectedDebtor(row);
                          setInstallmentState({
                            installmentAmount: Number(row.value) || 0,
                            installmentDate:
                              typeof row.datePayment === "string"
                                ? row.datePayment
                                : String(row.datePayment) || "",
                            paymentChannelAbbreviatedName:
                              String(row.paymentMethod) || "",
                          });
                          setIsOpenModalEdit(true);
                        }}
                      />
                    ) : (
                      <Detail
                        handleDelete={() => {
                          setSelectedDebtor(row);
                          setIsOpenModalDelete(true);
                        }}
                        handleEdit={() => {
                          setSelectedDebtor(row);
                          setInstallmentState({
                            installmentAmount: Number(row.value) || 0,
                            installmentDate:
                              typeof row.datePayment === "string"
                                ? row.datePayment
                                : String(row.datePayment) || "",
                            paymentChannelAbbreviatedName:
                              String(row.paymentMethod) || "",
                          });
                          setIsOpenModalEdit(true);
                        }}
                      />
                    )}
                  </Td>
                ))}
              </Tr>
            ))}

        {!loading &&
          paddedCurrentData.filter(
            (row: TableExtraordinaryInstallmentProps) => !row.__isPadding,
          ).length === 0 && (
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
        <DeleteModal
          handleClose={() => setIsOpenModalDelete(false)}
          handleDelete={handleDeleteAction}
          TextDelete={dataTableExtraordinaryInstallment.content}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          handleClose={() => setShowErrorModal(false)}
          isMobile={isMobile}
          message={messageError}
        />
      )}
    </Table>
  );
}
