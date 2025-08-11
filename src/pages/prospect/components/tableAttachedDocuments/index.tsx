import { useState, useEffect } from "react";
import { MdAttachFile, MdOutlineRemoveRedEye, MdEdit } from "react-icons/md";
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
  Stack,
} from "@inubekit/inubekit";

import { ListModal } from "@components/modals/ListModal";
import { BaseModal } from "@components/modals/baseModal";
import { optionButtons } from "@pages/prospect/outlets/financialReporting/config";
import { IBorrowerDocumentRule } from "@pages/applyForCredit/steps/attachedDocuments";
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
  ruleValues: IBorrowerDocumentRule[];
}

export function TableAttachedDocuments(props: ITableAttachedDocumentsProps) {
  const { isMobile, uploadedFilesByRow, setUploadedFilesByRow, ruleValues } =
    props;

  const [loading, setLoading] = useState(true);
  const [showAttachment, setShowAttachments] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [seeAttachment, setSeeAttachments] = useState(false);
  const [rowIdToDelete, setRowIdToDelete] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (rowIdToDelete) {
      handleRemoveAllFiles(rowIdToDelete);
      setShowDeleteModal(false);
      setRowIdToDelete(null);
    }
  };

  const {
    totalRecords,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    firstEntryInPage,
    lastEntryInPage,
  } = usePagination(ruleValues);
  const [currentRowId, setCurrentRowId] = useState<string>('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const visibleHeaders = isMobile
    ? headers.filter((header) => ["borrower", "actions"].includes(header.key))
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

  const handleSeeAttachment = (rowId: string) => {
    console.log("# show attachment", rowId);
    setCurrentRowId(rowId);
    setSeeAttachments(true);
  };

  const handleSetUploadedFiles = (
    files: { id: string; name: string; file: File }[] | null,
  ) => {
    console.log("entró a una funcion externa ");
    if (currentRowId) {
      setUploadedFilesByRow({
        ...uploadedFilesByRow,
        [currentRowId]: files || [],
      });
    }
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
          } else if (ruleValues.length === 0) {
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
            return ruleValues.map(
              (row: IBorrowerDocumentRule, rowIndex: number) => (
                <Tr key={rowIndex}>
                  {visibleHeaders.map((header, colIndex) => {
                    const cellData =
                      row[header.key as keyof { borrower: string }];
                    const customColumn = [
                      "download",
                      "remove",
                      "attached",
                      "actions"
                    ].includes(header.key);
                    console.log("customColumn: ", customColumn);
                    console.log("header ", header);
                    return (
                      <Td
                        key={colIndex}
                        width={customColumn ? "70px" : "auto"}
                        appearance={rowIndex % 2 === 0 ? "light" : "dark"}
                        type={customColumn ? "custom" : "text"}
                        align={
                          typeof header.action ||
                          (typeof cellData === "string" &&
                            cellData.includes("$"))
                            ? "left"
                            : "left"
                        }
                      >
                        {(() => {
                          if (header.key === "actions") {
                            return (
                              <Stack justifyContent="space-around">
                                <Icon
                                  icon={<MdAttachFile />}
                                  appearance="primary"
                                  size="16px"
                                  cursorHover
                                  onClick={() =>
                                    handleOpenAttachment(rowIndex.toString())
                                  }
                                />
                                {<Icon
                                  icon={<MdOutlineRemoveRedEye />}
                                  appearance="dark"
                                  size="16px"
                                  cursorHover
                                  onClick={() =>
                                    handleSeeAttachment(rowIndex.toString())
                                  }
                                  disabled={
                                    !uploadedFilesByRow[rowIndex.toString()] ||
                                    uploadedFilesByRow[rowIndex.toString()]
                                      .length === 0
                                  }
                                />}
                              </Stack>
                            );
                          }
                          return cellData;
                        })()}
                      </Td>
                    );
                  })}
                </Tr>
              ),
            );
          }
        })()}
      </Tbody>
      {!loading && ruleValues.length > 0 && (
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
            uploadedFilesByRow[currentRowId]
          }
          setUploadedFiles={handleSetUploadedFiles}
          onlyDocumentReceived={true}
        />
      )}
      {seeAttachment && (
        <ListModal
          title="Ver adjuntos"
          handleClose={() => setSeeAttachments(false)}
          isViewing={true}
          buttonLabel="Cerrar"
          dataDocument={
            currentRowId ? uploadedFilesByRow[currentRowId] || [] : []
          }
          uploadedFiles={
            currentRowId ? uploadedFilesByRow[currentRowId] || [] : []
          }
          setUploadedFiles={handleSetUploadedFiles}
        />
      )}
      {showDeleteModal && (
        <BaseModal
          title={dataReport.delete}
          nextButton={dataReport.delete}
          backButton={dataReport.close}
          handleBack={() => setShowDeleteModal(false)}
          handleNext={handleConfirmDelete}
        >
          <Text>{dataReport.deleteText}</Text>
        </BaseModal>
      )}
    </Table>
  );
}
