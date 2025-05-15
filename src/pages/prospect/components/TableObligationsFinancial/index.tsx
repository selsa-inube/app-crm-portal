import { useState, useEffect } from "react";
import localforage from "localforage";
import {
  MdAdd,
  MdCached,
  MdDeleteOutline,
  MdOutlineEdit,
} from "react-icons/md";
import {
  Pagination,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Stack,
  Icon,
  Text,
  SkeletonLine,
  SkeletonIcon,
  Button,
  useMediaQuery,
} from "@inubekit/inubekit";

import { EditFinancialObligationModal } from "@components/modals/editFinancialObligationModal";
import { ListModal } from "@components/modals/ListModal";
import { NewPrice } from "@components/modals/ReportCreditsModal/components/newPrice";
import { currencyFormat } from "@utils/formatData/currency";

import { headers, dataReport } from "./config";
import { usePagination } from "./utils";
import { IDataInformationItem } from "./types";

export interface ITableFinancialObligationsProps {
  type?: string;
  id?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues?: any;
  refreshKey?: number;
  showActions?: boolean;
  showOnlyEdit?: boolean;
  showButtons?: boolean;
}

export function TableFinancialObligations(
  props: ITableFinancialObligationsProps,
) {
  const { refreshKey, showActions, showOnlyEdit, initialValues, showButtons } =
    props;
  const [loading, setLoading] = useState(true);
  const [extraDebtors, setExtraDebtors] = useState<
    ITableFinancialObligationsProps[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedDebtor, setSelectedDebtor] =
    useState<ITableFinancialObligationsProps | null>(null);

  const handleEdit = (debtor: ITableFinancialObligationsProps) => {
    setSelectedDebtor(debtor);
    setIsModalOpen(true);
  };

  const {
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    firstEntryInPage,
  } = usePagination();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

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
    const loadExtraDebtors = async () => {
      const storedData =
        (await localforage.getItem<ITableFinancialObligationsProps[]>(
          "financial_obligation",
        )) || [];
      setExtraDebtors(storedData);
    };

    loadExtraDebtors();
  }, [refreshKey]);

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
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating debtor:", error);
    }
  };

  const dataInformation = initialValues?.borrower_properties?.length
    ? initialValues.borrower_properties.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (prop: any) => prop.property_name === "FinancialObligation",
      )
    : extraDebtors;

  const totalBalance = dataInformation.reduce(
    (sum: number, item: IDataInformationItem) => {
      const balance =
        typeof item.balance === "number"
          ? item.balance
          : typeof item.property_value === "string"
            ? parseFloat(item.property_value.split(",")[1]) || 0
            : 0;
      return sum + balance;
    },
    0,
  );

  const totalFee = dataInformation.reduce(
    (sum: number, item: IDataInformationItem) => {
      const fee =
        typeof item.fee === "number"
          ? item.fee
          : typeof item.property_value === "string"
            ? parseFloat(item.property_value.split(",")[2]) || 0
            : 0;
      return sum + fee;
    },
    0,
  );

  return (
    <Stack direction="column" width="100%" gap="16px">
      {showButtons && (
        <Stack gap="16px" justifyContent="end">
          <Button iconAfter={<MdCached />} variant="outlined">
            {dataReport.restore}
          </Button>
          <Button iconAfter={<MdAdd />}>{dataReport.addObligations}</Button>
        </Stack>
      )}
      <Table tableLayout="auto">
        <Thead>
          <Tr>
            {loading
              ? visibleHeaders.map((_, index) => (
                  <Td key={index} type="custom">
                    <SkeletonIcon />
                  </Td>
                ))
              : visibleHeaders.map((header, index) => (
                  <Th
                    key={index}
                    action={header.action}
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {header.label}
                  </Th>
                ))}
          </Tr>
        </Thead>
        <Tbody>
          {(() => {
            if (loading) {
              return (
                <Tr>
                  {visibleHeaders.map((_, index) => (
                    <Td key={index} type="custom">
                      <SkeletonLine />
                    </Td>
                  ))}
                </Tr>
              );
            } else if (extraDebtors.length === 0) {
              return (
                <Tr>
                  <Td
                    colSpan={visibleHeaders.length}
                    align="center"
                    type="custom"
                  >
                    <Text
                      size="large"
                      type="label"
                      appearance="gray"
                      textAlign="center"
                    >
                      {dataReport.noData}
                    </Text>
                  </Td>
                </Tr>
              );
            } else {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return dataInformation.map((prop: any, rowIndex: number) => {
                let values: string[] = [];
                if (typeof prop.property_value === "string") {
                  values = prop.property_value
                    .split(",")
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map((val: any) => val.trim());
                } else if (Array.isArray(prop.property_value)) {
                  values = prop.property_value.map(String);
                } else {
                  values = Object.entries(prop)
                    .filter(([key]) => key !== "id")
                    .map(([, value]) => String(value).trim());
                }

                return (
                  <Tr key={rowIndex}>
                    {visibleHeaders.map((header, colIndex) => {
                      let cellData = values[colIndex] || "";
                      const isCurrency = ["balance", "fee"].includes(
                        header.key,
                      );
                      if (isCurrency) {
                        cellData = isNaN(Number(cellData))
                          ? cellData
                          : currencyFormat(Number(cellData), false);
                      }

                      const isFromInitialValues = Boolean(prop.property_name);
                      if (
                        isFromInitialValues &&
                        colIndex === values.length - 2
                      ) {
                        cellData =
                          `${values[colIndex]}/${values[colIndex + 1]}`.trim();
                      }

                      return (
                        <Td
                          key={colIndex}
                          appearance={rowIndex % 2 === 0 ? "light" : "dark"}
                          type={header.action ? "custom" : "text"}
                          align={isCurrency ? "right" : "center"}
                        >
                          {header.action ? (
                            <Stack justifyContent="space-around">
                              <Icon
                                icon={<MdOutlineEdit />}
                                appearance="dark"
                                size="16px"
                                onClick={() => handleEdit(prop)}
                                cursorHover
                              />
                              {!showOnlyEdit && (
                                <Icon
                                  icon={<MdDeleteOutline />}
                                  appearance="danger"
                                  size="16px"
                                  onClick={() => {
                                    setSelectedDebtor(prop);
                                    setIsDeleteModal(true);
                                  }}
                                  cursorHover
                                />
                              )}
                            </Stack>
                          ) : (
                            cellData
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              });
            }
          })()}
        </Tbody>
        {!loading && dataInformation.length > 0 && (
          <Tfoot>
            <Tr border="bottom">
              <Td colSpan={visibleHeaders.length} type="custom" align="center">
                <Pagination
                  firstEntryInPage={firstEntryInPage}
                  lastEntryInPage={dataInformation.length}
                  totalRecords={dataInformation.length}
                  handleStartPage={handleStartPage}
                  handlePrevPage={handlePrevPage}
                  handleNextPage={handleNextPage}
                  handleEndPage={handleEndPage}
                />
              </Td>
            </Tr>
          </Tfoot>
        )}
        {isModalOpen && selectedDebtor && (
          <EditFinancialObligationModal
            title={`${dataReport.edit} ${selectedDebtor.type || ""}`}
            onCloseModal={() => setIsModalOpen(false)}
            onConfirm={async (updatedDebtor) => {
              await handleUpdate(updatedDebtor);
            }}
            initialValues={selectedDebtor}
            confirmButtonText={dataReport.save}
          />
        )}
        {isDeleteModal && (
          <ListModal
            title={dataReport.deletion}
            handleClose={() => setIsDeleteModal(false)}
            handleSubmit={() => setIsDeleteModal(false)}
            onSubmit={() => {
              if (selectedDebtor) {
                handleDelete(selectedDebtor.id as string);
                setIsDeleteModal(false);
              }
            }}
            buttonLabel={dataReport.delete}
            content={dataReport.content}
            cancelButton={dataReport.cancel}
          />
        )}
      </Table>
      <Stack
        gap="48px"
        direction={!isMobile ? "row" : "column"}
        justifyContent="center"
      >
        {loading ? (
          <SkeletonLine />
        ) : (
          <NewPrice
            value={totalBalance}
            label={dataReport.descriptionTotalBalance}
          />
        )}
        {loading ? (
          <SkeletonLine />
        ) : (
          <NewPrice value={totalFee} label={dataReport.descriptionTotalFee} />
        )}
      </Stack>
    </Stack>
  );
}
