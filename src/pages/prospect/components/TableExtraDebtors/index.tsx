import { useState, useEffect } from "react";
import localforage from "localforage";
import { MdCached, MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
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
  useMediaQuery,
} from "@inubekit/inubekit";

import { ExtraDebtorModal } from "@components/modals/extraDebtorModal";

import { headers, dataReport } from "./config";
import { usePagination } from "./utils";

export interface ExtraDebtor {
  docNumber?: string;
  name?: string;
  actions?: boolean;
  [key: string]: React.ReactNode;
  refreshKey: number;
}

export function TableExtraDebtors(props: ExtraDebtor) {
  const { refreshKey } = props;
  const [loading, setLoading] = useState(true);
  const [extraDebtors, setExtraDebtors] = useState<ExtraDebtor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState<ExtraDebtor | null>(
    null,
  );

  const handleEdit = (debtor: ExtraDebtor) => {
    setSelectedDebtor(debtor);
    setIsModalOpen(true);
  };

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
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const loadExtraDebtors = async () => {
      const storedData =
        (await localforage.getItem<ExtraDebtor[]>("extra_debtors")) || [];
      setExtraDebtors(storedData);
    };

    loadExtraDebtors();
  }, [refreshKey]);

  const isMobile = useMediaQuery("(max-width:880px)");
  const visibleHeaders = isMobile
    ? headers.filter((header) =>
        ["docNumber", "name", "actions"].includes(header.key),
      )
    : headers;

  return (
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
                <Th key={index} action={header.action} align="center">
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
            return extraDebtors.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {visibleHeaders.map((header, colIndex) => {
                  const cellData = row[header.key] as
                    | string
                    | number
                    | undefined;
                  return (
                    <Td
                      key={colIndex}
                      appearance={rowIndex % 2 === 0 ? "light" : "dark"}
                      type={header.action ? "custom" : "text"}
                      align={
                        typeof cellData === "number" ||
                        (typeof cellData === "string" && cellData.includes("$"))
                          ? "center"
                          : "center"
                      }
                    >
                      {header.action ? (
                        <Stack justifyContent="space-around">
                          <Icon
                            icon={<MdOutlineEdit />}
                            appearance="dark"
                            size="16px"
                            onClick={() => handleEdit(row)}
                            cursorHover
                          />
                          <Icon
                            icon={<MdDeleteOutline />}
                            appearance="danger"
                            size="16px"
                            onClick={() => console.log("delete")}
                            cursorHover
                          />
                        </Stack>
                      ) : (
                        cellData
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ));
          }
        })()}
      </Tbody>
      {!loading && extraDebtors.length > 0 && (
        <Tfoot>
          <Tr border="bottom">
            <Td colSpan={visibleHeaders.length} type="custom" align="center">
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
      {isModalOpen && selectedDebtor && (
        <ExtraDebtorModal
          title="Editar Deudor"
          confirmButtonText="Actualizar"
          iconBefore={<MdCached />}
          initialValues={selectedDebtor}
          onCloseModal={() => setIsModalOpen(false)}
          onConfirm={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </Table>
  );
}
