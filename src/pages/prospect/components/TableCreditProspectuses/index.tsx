import { useState } from "react";
import { MdAdd, MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
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

const headers = [
  { label: "Código", key: "codigo" },
  { label: "Fecha de solicitud", key: "fecha" },
  { label: "Destino", key: "destino" },
  { label: "Valor", key: "valor" },
  { label: "Acciones", key: "acciones", action: true },
];

type RowData = {
  codigo: string;
  fecha: string;
  destino: string;
  valor: string;
};

const data: RowData[] = [
  {
    codigo: "999994",
    fecha: "02/Sep/2024",
    destino: "Vacaciones",
    valor: "10.000.000",
  },
  {
    codigo: "999993",
    fecha: "05/Sep/2021",
    destino: "Libre",
    valor: "45.000.000",
  },
  {
    codigo: "999992",
    fecha: "10/Jul/2024",
    destino: "Libre",
    valor: "25.000.000",
  },
];

export function TableCreditProspectuses() {
  const pageSize = 5;
  const [page, setPage] = useState(1);
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const firstEntryInPage = (page - 1) * pageSize + 1;
  const lastEntryInPage = Math.min(page * pageSize, totalRecords);

  const handleStartPage = () => setPage(1);
  const handlePrevPage = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNextPage = () =>
    setPage((prev) => Math.min(totalPages, prev + 1));
  const handleEndPage = () => setPage(totalPages);

  const paginatedData = data.slice(firstEntryInPage - 1, lastEntryInPage);

  return (
    <Table tableLayout="auto">
      <Thead>
        <Tr>
          {headers.map((header) => (
            <Th key={header.key} align="center">
              {header.label}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {paginatedData.map((row, rowIndex) => (
          <Tr key={rowIndex} zebra={rowIndex % 2 !== 0}>
            {headers.map((header, colIndex) => (
              <Td key={colIndex} align="center">
                {header.action ? (
                  <Stack justifyContent="center" gap="8px">
                    <Icon
                      icon={<MdAdd />}
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
        ))}
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
