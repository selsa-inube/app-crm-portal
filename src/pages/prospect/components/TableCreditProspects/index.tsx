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

import { usePagination } from "./utils";
import { tableConfig } from "./config";
import { RowData } from "./types";

interface TableCreditProspectsProps {
  prospectData: IProspect[];
}

const getDestinationName = (code: string): string => {
  const destination = MoneyDestinationTranslations.find(
    (item) => item.Code === code,
  );
  return destination
    ? destination.Name
    : code || tableConfig.messages.notAvailable;
};

export function TableCreditProspects({
  prospectData,
}: TableCreditProspectsProps) {
  const tableData =
    prospectData && prospectData.length > 0
      ? prospectData.map((prospect) => ({
          code: prospect.prospectCode,
          date: prospect.timeOfCreation
            ? new Date(prospect.timeOfCreation).toLocaleDateString()
            : tableConfig.messages.notAvailable,
          destination: getDestinationName(
            prospect.moneyDestinationAbbreviatedName,
          ),
          value: prospect.requestedAmount
            ? prospect.requestedAmount.toString()
            : tableConfig.messages.notAvailable,
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
          {tableConfig.headers.map((header) => (
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
              {tableConfig.headers.map((header, colIndex) => (
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
                    (row[header.key as keyof RowData] ?? "")
                  )}
                </Td>
              ))}
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={tableConfig.headers.length} align="center">
              {tableConfig.messages.noDataAvailable}
            </Td>
          </Tr>
        )}
      </Tbody>
      <Tfoot>
        <Tr border="bottom">
          <Td colSpan={tableConfig.headers.length} type="custom" align="center">
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
