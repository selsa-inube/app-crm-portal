import { useState } from "react";
import { MdAttachFile, MdOutlineEdit } from "react-icons/md";
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
  useFlag,
  Stack,
  Spinner,
} from "@inubekit/inubekit";

import { ListModal } from "@components/modals/ListModal";
import { BaseModal } from "@components/modals/baseModal";
import { optionButtons } from "@pages/prospect/outlets/financialReporting/config";
import { IBorrowerDocumentRule } from "@pages/applyForCredit/steps/attachedDocuments";
import { ICustomerData } from "@context/CustomerContext/types";
import { IFile } from "@components/modals/ListModal";

import { headers, dataReport } from "./config";
import { usePagination } from "./utils";

interface ITableAttachedDocumentsProps {
  isMobile: boolean;
  uploadedFilesByRow: {
    [key: string]: IFile[];
  };
  customerData: ICustomerData;
  setUploadedFilesByRow: (files: { [key: string]: IFile[] }) => void;
  ruleValues: IBorrowerDocumentRule[];
  isLoading: boolean;
  showErrorModal: boolean;
}

export function TableAttachedDocuments(props: ITableAttachedDocumentsProps) {
  const {
    isMobile,
    uploadedFilesByRow,
    setUploadedFilesByRow,
    ruleValues,
    isLoading,
  } = props;

  const [showAttachment, setShowAttachments] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [seeAttachment, setSeeAttachments] = useState(false);
  const [currentRowId, setCurrentRowId] = useState<string>("");
  const [rowIdToDelete, setRowIdToDelete] = useState<string | null>(null);

  const {
    totalRecords,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    firstEntryInPage,
    lastEntryInPage,
  } = usePagination(ruleValues);

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

  const handleSetUploadedFiles = (files: IFile[]) => {
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

  const handleConfirmDelete = () => {
    if (rowIdToDelete) {
      handleRemoveAllFiles(rowIdToDelete);
      setShowDeleteModal(false);
      setRowIdToDelete(null);
    }
  };

  const iconToShowOnActions = (rowIndex: number) => {
    const hasNoFiles = uploadedFilesByRow[rowIndex];
    return hasNoFiles === undefined || hasNoFiles.length === 0 ? (
      <MdAttachFile />
    ) : (
      <MdOutlineEdit />
    );
  };

  const getTitleToModal = (rowId: string) => {
    const rowIdParsed = parseInt(rowId);
    if (Number.isNaN(rowIdParsed)) return "Adjuntar";
    return ruleValues[rowIdParsed].value;
  };

  const visibleHeaders = isMobile
    ? headers.filter((header) => ["borrower", "actions"].includes(header.key))
    : headers;

  return (
    <>
      {isLoading ? (
        <Stack
          direction="column"
          gap="16px"
          justifyContent="center"
          alignItems="center"
          padding="32px"
          width="100%"
        >
          <Spinner size="large" appearance="primary" />
          <Text type="title" size="medium" appearance="dark">
            {dataReport.loading}
          </Text>
        </Stack>
      ) : (
        <Table tableLayout="auto">
          <Thead>
            <Tr>
              {visibleHeaders.map((header, index) => (
                <Th key={index} action={header.action} align="center">
                  {header.label}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {(() => {
              if (ruleValues.length === 0) {
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
                          "actions",
                        ].includes(header.key);
                        return (
                          <Td
                            key={colIndex}
                            width={customColumn ? "70px" : "auto"}
                            appearance={rowIndex % 2 === 0 ? "light" : "dark"}
                            type={customColumn ? "custom" : "text"}
                            align={"left"}
                          >
                            {(() => {
                              if (header.key === "actions") {
                                return (
                                  <Stack justifyContent="space-around">
                                    <Icon
                                      icon={iconToShowOnActions(rowIndex)}
                                      appearance="primary"
                                      size="16px"
                                      cursorHover
                                      onClick={() =>
                                        handleOpenAttachment(
                                          rowIndex.toString(),
                                        )
                                      }
                                    />
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
          {!isLoading && ruleValues.length > 0 && (
            <Tfoot>
              <Tr border="bottom">
                <Td
                  colSpan={visibleHeaders.length}
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
        </Table>
      )}
      {showAttachment && (
        <ListModal
          title={getTitleToModal(currentRowId)}
          handleClose={() => setShowAttachments(false)}
          optionButtons={optionButtons}
          buttonLabel="Adjuntar"
          uploadMode="local"
          uploadedFiles={uploadedFilesByRow[currentRowId]}
          setUploadedFiles={handleSetUploadedFiles}
          onlyDocumentReceived={true}
        />
      )}
      {seeAttachment && (
        <ListModal
          title={getTitleToModal(currentRowId)}
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
    </>
  );
}
