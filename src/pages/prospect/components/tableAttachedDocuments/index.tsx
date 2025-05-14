import { useState, useEffect } from "react";
import {
  MdAttachFile,
  MdOutlineFileDownload,
  MdOutlineHighlightOff,
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
  Icon,
  Text,
  SkeletonLine,
  SkeletonIcon,
  useFlag,
  Tag,
} from "@inubekit/inubekit";

import { get } from "@mocks/utils/dataMock.service";
import { mockAttachedDocuments } from "@mocks/filing-application/attached-documents/attacheddocuments.mock";
import { ListModal } from "@components/modals/ListModal";
import { optionButtons } from "@pages/prospect/outlets/financialReporting/config";
import { ICustomerData } from "@context/CustomerContext/types";

import { headers, dataReport } from "./config";
import { usePagination } from "./utils";

interface ITableAttachedDocumentsProps {
  isMobile: boolean;
  uploadedFilesByRow: {
    [key: string]: { id: string; name: string; file: File }[];
  };
  customerData: ICustomerData;
  setUploadedFilesByRow: (files: {
    [key: string]: { id: string; name: string; file: File }[];
  }) => void;
}

export function TableAttachedDocuments(props: ITableAttachedDocumentsProps) {
  const { isMobile, uploadedFilesByRow, setUploadedFilesByRow } = props;

  const [loading, setLoading] = useState(true);
  const [showAttachment, setShowAttachments] = useState(false);

  const {
    totalRecords,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    firstEntryInPage,
    lastEntryInPage,
  } = usePagination();

  const [attachedDocuements, setAttachedDocuements] = useState(
    mockAttachedDocuments,
  );
  const [currentRowId, setCurrentRowId] = useState<string | null>(null);

  useEffect(() => {
    get("attached_documents")
      .then((data) => {
        if (data && Array.isArray(data)) {
          setAttachedDocuements(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching money destinations data:", error.message);
      });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const visibleHeaders = isMobile
    ? headers.filter((header) =>
        ["borrower", "attach", "download", "remove"].includes(header.key),
      )
    : headers;

  const { addFlag } = useFlag();

  const handleFlag = () => {
    addFlag({
      title: `${dataReport.titleFlagDelete}`,
      description: `${dataReport.descriptionFlagDelete}`,
      appearance: "success",
      duration: 5000,
    });
  };

  const handleOpenAttachment = (rowId: string) => {
    setCurrentRowId(rowId);
    setShowAttachments(true);
  };

  const handleSetUploadedFiles = (
    files: { id: string; name: string; file: File }[] | null,
  ) => {
    if (currentRowId) {
      setUploadedFilesByRow({
        ...uploadedFilesByRow,
        [currentRowId]: files || [],
      });
    }
  };

  const handleDownloadFile = (rowId: string) => {
    const files = uploadedFilesByRow[rowId];
    if (!files || files.length === 0) return;

    files.forEach((fileData) => {
      const url = URL.createObjectURL(fileData.file);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileData.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  const handleRemoveAllFiles = (rowId: string) => {
    const updated = { ...uploadedFilesByRow };
    delete updated[rowId];
    setUploadedFilesByRow(updated);
    handleFlag();
  };

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
            <Tr>
              {visibleHeaders.map((_, index) => (
                <Td key={index} type="custom">
                  <SkeletonLine />
                </Td>
              ))}
            </Tr>;
          } else if (attachedDocuements.length === 0) {
            <Tr>
              <Td colSpan={visibleHeaders.length} align="center" type="custom">
                <Text
                  size="large"
                  type="label"
                  appearance="gray"
                  textAlign="center"
                >
                  {dataReport.noData}
                </Text>
              </Td>
            </Tr>;
          } else {
            return attachedDocuements.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {visibleHeaders.map((header, colIndex) => {
                  const cellData = row[header.key];
                  const customColumn = [
                    "attach",
                    "download",
                    "remove",
                    "attached",
                  ].includes(header.key);
                  return (
                    <Td
                      key={colIndex}
                      width={customColumn ? "70px" : "auto"}
                      appearance={rowIndex % 2 === 0 ? "light" : "dark"}
                      type={customColumn ? "custom" : "text"}
                      align={
                        typeof header.action ||
                        (typeof cellData === "string" && cellData.includes("$"))
                          ? "center"
                          : "left"
                      }
                    >
                      {(() => {
                        if (header.key === "attach") {
                          return (
                            <Icon
                              icon={<MdAttachFile />}
                              appearance="dark"
                              size="16px"
                              cursorHover
                              onClick={() =>
                                handleOpenAttachment(rowIndex.toString())
                              }
                            />
                          );
                        }
                        if (header.key === "attached") {
                          if (
                            uploadedFilesByRow[rowIndex.toString()]?.length > 0
                          ) {
                            return <Tag label="Adjunto" appearance="success" />;
                          }
                          return <Tag label="No adjunto" appearance="danger" />;
                        }
                        return cellData;
                      })()}
                      {header.key === "download" && (
                        <Icon
                          icon={<MdOutlineFileDownload />}
                          appearance="dark"
                          size="16px"
                          cursorHover
                          disabled={
                            !uploadedFilesByRow[rowIndex.toString()] ||
                            uploadedFilesByRow[rowIndex.toString()].length === 0
                          }
                          onClick={() =>
                            handleDownloadFile(rowIndex.toString())
                          }
                        />
                      )}
                      {header.key === "remove" && (
                        <Icon
                          icon={<MdOutlineHighlightOff />}
                          appearance="danger"
                          size="16px"
                          cursorHover
                          disabled={
                            !uploadedFilesByRow[rowIndex.toString()] ||
                            uploadedFilesByRow[rowIndex.toString()].length === 0
                          }
                          onClick={() =>
                            handleRemoveAllFiles(rowIndex.toString())
                          }
                        />
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ));
          }
        })()}
      </Tbody>
      {!loading && attachedDocuements.length > 0 && (
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
      {showAttachment && (
        <ListModal
          title="Adjuntar"
          handleClose={() => setShowAttachments(false)}
          optionButtons={optionButtons}
          buttonLabel="Guardar"
          uploadMode="local"
          uploadedFiles={
            currentRowId ? uploadedFilesByRow[currentRowId] || [] : []
          }
          setUploadedFiles={handleSetUploadedFiles}
          onlyDocumentReceived={true}
        />
      )}
    </Table>
  );
}
