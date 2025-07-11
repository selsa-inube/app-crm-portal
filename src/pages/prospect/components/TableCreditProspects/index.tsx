import { MdOutlineEdit, MdDeleteOutline, MdOutlineSend } from "react-icons/md";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Stack,
  Tfoot,
  Pagination,
} from "@inubekit/inubekit";

import { IProspect } from "@services/prospects/ProspectsByCustomerCode/types";
import { MoneyDestinationTranslations } from "@services/enum/moneyDestinationTranslations";

import { headers } from "./config";
import { usePagination } from "./utils";

interface TableCreditProspectsProps {
  prospectData: IProspect[];
}

const getDestinationName = (code: string): string => {
  const destination = MoneyDestinationTranslations.find(
    (item) => item.Code === code,
  );
  return destination ? destination.Name : code || "N/A";
};

export function TableCreditProspects({
  prospectData,
}: TableCreditProspectsProps) {
  const tableData =
    prospectData && prospectData.length > 0
      ? prospectData.map((prospect) => ({
          codigo: prospect.prospectCode,
          fecha: prospect.timeOfCreation
            ? new Date(prospect.timeOfCreation).toLocaleDateString()
            : "N/A",
          destino: getDestinationName(prospect.moneyDestinationAbbreviatedName),
          valor: prospect.requestedAmount
            ? prospect.requestedAmount.toString()
            : "N/A",
        }))
      : [];

  const {
    totalRecords,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    firstEntryInPage,
    lastEntryInPage,
    currentData,
  } = usePagination(tableData);

  return (
    <Table tableLayout="auto">
      <Thead>
        <Tr>
          {headers.map((header) => (
            <Th key={header.key} align="center" action={header.action}>
              {header.label}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {currentData.length > 0 ? (
          currentData.map((row, rowIndex) => (
            <Tr key={rowIndex} zebra={rowIndex % 2 !== 0}>
              {headers.map((header, colIndex) => (
                <Td key={colIndex} align="center">
                  {header.action ? (
                    <Stack justifyContent="space-between" gap="8px">
                      <Icon
                        icon={<MdOutlineSend />}
                        size="18px"
                        appearance="primary"
                        cursorHover
                      />
                      <Icon
                        icon={<MdOutlineEdit />}
                        size="18px"
                        appearance="dark"
                        cursorHover
                      />
                      <Icon
                        icon={<MdDeleteOutline />}
                        size="18px"
                        appearance="danger"
                        cursorHover
                      />
                    </Stack>
                  ) : (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ((row as any)[header.key] ?? "")
                  )}
                </Td>
              ))}
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={headers.length} align="center">
              No hay datos disponibles
            </Td>
          </Tr>
        )}
      </Tbody>
      <Tfoot>
        <Tr border="bottom">
          <Td colSpan={headers.length} type="custom" align="center">
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
    </Table>
  );
}
