import { useRef, useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { MdClear, MdOutlineRemoveRedEye } from "react-icons/md";
import {
  Stack,
  Icon,
  Text,
  useFlag,
  useMediaQuery,
  Divider,
  Blanket,
  Button,
  Grid,
} from "@inubekit/inubekit";

import { optionFlags } from "@pages/prospect/outlets/financialReporting/config";
import { saveDocument } from "@services/creditRequest/saveDocument";
import { validationMessages } from "@validations/validationMessages";
import { AppContext } from "@context/AppContext";
import { File } from "@components/inputs/File";
import { formatFileSize } from "@utils/size";
import { truncateTextToMaxLength } from "@utils/formatData/text";

import { DocumentViewer } from "../DocumentViewer";
import {
  StyledAttachContainer,
  StyledContainerClose,
  StyledContainerContent,
  StyledDocuments,
  StyledItem,
  StyledModal,
} from "./styles";
import { listModalData } from "./config";

export interface IOptionButtons {
  label: string;
  variant: "filled" | "outlined" | "none";
  icon?: React.JSX.Element;
  fullwidth?: boolean;
  onClick?: () => void;
}

export interface IListdataProps {
  data: { id: string; name: string }[] | null | undefined;
  onDelete?: (id: string) => void;
  icon?: React.ReactNode;
  onPreview?: (id: string, name: string) => void;
}

export interface IListModalProps {
  title: string;
  buttonLabel: string;
  uploadedFiles: IFile[];
  handleClose: () => void;
  setUploadedFiles: (files: IFile[]) => void;
  deletedFiles: IFile[];
  setDeletedFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
  onlyDocumentReceived?: boolean;
  nameRuleValue?: string;
  handleSubmit?: () => void;
  onSubmit?: () => void;
  cancelButton?: string;
  appearanceCancel?:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "help"
    | "dark"
    | "gray"
    | "light";
  portalId?: string;
  content?: JSX.Element | JSX.Element[] | string;
  optionButtons?: IOptionButtons;
  uploadMode?: string;
  id?: string;
  dataDocument?: { id: string; name: string }[];
  isViewing?: boolean;
}

export interface IFile {
  id: string;
  name: string;
  file: File;
  wasAlreadyAttached: boolean;
  selectedToDelete: boolean;
  justUploaded: boolean;
}

export const ListModal = (props: IListModalProps) => {
  const {
    title,
    portalId,
    content,
    optionButtons,
    cancelButton,
    appearanceCancel = "primary",
    buttonLabel,
    uploadMode,
    dataDocument,
    isViewing,
    uploadedFiles,
    onlyDocumentReceived,
    handleClose,
    handleSubmit,
    onSubmit,
    setUploadedFiles,
    id,
  } = props;

  const [openFlag, setOpenFlag] = useState(false);

  const node = document.getElementById(portalId ?? "portal");
  if (!node) {
    throw new Error(validationMessages.errorNodo);
  }
  const { addFlag } = useFlag();

  const isMobile = useMediaQuery("(max-width: 700px)");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { businessUnitSigla } = useContext(AppContext);

  const [isDragging, setIsDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<IFile[]>([]);
  const [openViewer, setOpenViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string;
    url: string;
  }>({ name: "", url: "" });

  useEffect(() => {
    if (pendingFiles.length === 1 && uploadedFiles?.length > 0) {
      keepUploadedFiles();
    }
  }, [pendingFiles]);

  const dragCounter = useRef(0);
  const MAX_FILE_SIZE = 2.5 * 1024 * 1024;

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const newFiles = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      file,
      wasAlreadyAttached: false,
      selectedToDelete: false,
      justUploaded: true,
    }));

    keepUploadedFiles();
    setPendingFiles((prev) => [...markFilesJustUploaded(prev), ...newFiles]);
  };

  const Listdata = (props: IListdataProps) => {
    const { data, icon, onDelete, onPreview } = props;

    const maxLength = isMobile ? 20 : 40;

    return (
      <StyledDocuments>
        {data?.map((element) => (
          <StyledItem key={element.id}>
            <Text>{truncateTextToMaxLength(element.name, maxLength)}</Text>
            <Icon
              icon={icon}
              appearance="dark"
              spacing="narrow"
              size="24px"
              cursorHover
              onClick={() => {
                if (onDelete) {
                  onDelete(element.id);
                } else if (onPreview) {
                  onPreview(element.id, element.name);
                }
              }}
            />
          </StyledItem>
        ))}
      </StyledDocuments>
    );
  };

  type FlagAppearance =
    | "primary"
    | "danger"
    | "warning"
    | "success"
    | "help"
    | "gray"
    | "dark";

  const handleFlag = (
    title: string,
    description: string,
    appearance: FlagAppearance,
  ) => {
    addFlag({
      title: title,
      description: description,
      appearance: appearance,
      duration: 5000,
    });
  };

  const handleUpload = async () => {
    deleteFilesUploaded();
    if (!setUploadedFiles) return;

    if (uploadMode === "local") {
      if (pendingFiles.length > 0) {
        const filesMarkedAsUploaded = markFilesAsUploaded(pendingFiles);
        const filesWithoutDeleteMark = filesMarkedAsUploaded.filter(
          (file) => !file.selectedToDelete,
        );
        const markFilesJustUploadedFalse = markFilesJustUploaded(
          filesWithoutDeleteMark,
        );

        setUploadedFiles(markFilesJustUploadedFalse);
      }

      handleClose();
      return;
    }
    try {
      if (pendingFiles.length > 0) {
        for (const fileData of pendingFiles) {
          await saveDocument(
            businessUnitPublicCode,
            id,
            fileData.name.split(".").slice(0, -1).join("."),
            fileData.file,
          );
        }
      }

      handleClose();
      handleFlag(
        optionFlags.title,
        optionFlags.description,
        optionFlags.appearance as FlagAppearance,
      );

      setPendingFiles([]);
    } catch (error) {
      handleFlag(
        optionFlags.title,
        optionFlags.description,
        optionFlags.appearanceError as FlagAppearance,
      );
    }
  };

  const isDisabled = () => {
    if (onlyDocumentReceived) {
      const totalFiles = pendingFiles.length + (uploadedFiles?.length || 0);
      return totalFiles < 1;
    }

    return (
      pendingFiles.length === 0 &&
      (!uploadedFiles || uploadedFiles.length === 0)
    );
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);

    if (!setUploadedFiles) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      if (file.type === "application/pdf") {
        if (file.size <= MAX_FILE_SIZE) {
          const newFile = {
            id: crypto.randomUUID(),
            name: file.name,
            file,
            wasAlreadyAttached: false,
            selectedToDelete: false,
            justUploaded: true,
          };

          setPendingFiles((prev) => [...prev, newFile]);
        } else {
          alert(listModalData.exceedSize);
        }
      } else {
        alert(listModalData.onlypdf);
      }

      e.dataTransfer.clearData();
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePreview = (id: string, name: string, pendingFile?: File) => {
    const fileData = uploadedFiles?.find((file) => file.id === id);
    let url;

    if (fileData?.file) {
      url = URL.createObjectURL(fileData.file);
    }

    if (pendingFile) {
      url = URL.createObjectURL(pendingFile);
    }

    if (!url) return;

    setSelectedDocument({ name, url });
    setOpenViewer(true);
  };

  const onDeleteOneFile = (id: string) => {
    const newUploadedFiles = uploadedFiles.map((file: IFile) => {
      if (file.id === id) {
        return { ...file, selectedToDelete: true };
      }

      return file;
    });

    setUploadedFiles(newUploadedFiles);

    let deletedFiles = pendingFiles.map((file: IFile) => {
      if (file.id === id && file.wasAlreadyAttached) {
        return { ...file, selectedToDelete: true };
      }

      return file;
    });
    deletedFiles = deletedFiles.filter(
      (file: IFile) => file.id !== id || file.wasAlreadyAttached,
    );

    setPendingFiles(deletedFiles);
  };

  const keepUploadedFiles = () => {
    const updatedUploadedFiles = markFilesAsUploaded(uploadedFiles);
    const mergedFiles = [...updatedUploadedFiles, ...pendingFiles];

    setUploadedFiles([]);
    setPendingFiles(mergedFiles);
  };

  const handleCancelDeleteFile = () => {
    const cancelDeleteUploadedFiles = markFilesProcessDelete(
      uploadedFiles,
      false,
    );

    let returnFilesUploaded = pendingFiles.filter(
      (file) => file.wasAlreadyAttached,
    );
    returnFilesUploaded = markFilesProcessDelete(returnFilesUploaded, false);

    setUploadedFiles([...cancelDeleteUploadedFiles, ...returnFilesUploaded]);
  };
  const handleCancel = () => {
    if (!pendingFiles) return;

    const alreadyFilesMarkedAsUploaded = pendingFiles.filter(
      (file) => file.wasAlreadyAttached,
    );
    let mergedFiles = [...alreadyFilesMarkedAsUploaded, ...uploadedFiles];

    mergedFiles = markFilesJustUploaded(mergedFiles);

    setUploadedFiles(mergedFiles);
    handleCancelDeleteFile();
    setPendingFiles([]);
    handleClose();
  };

  const deleteFilesUploaded = () => {
    if (!uploadedFiles) return;
    const newUploadedFiles = uploadedFiles.filter(
      (file) => !file.selectedToDelete,
    );

    setUploadedFiles(newUploadedFiles);
  };

  const markFilesAsUploaded = (files: IFile[]) => {
    if (!files) return [];

    return files.map((file) => ({
      ...file,
      wasAlreadyAttached: true,
    }));
  };

  const markFilesProcessDelete = (files: IFile[], mark: boolean) => {
    return files.map((file: IFile) => {
      return { ...file, selectedToDelete: mark };
    });
  };

  const markFilesJustUploaded = (files: IFile[]) => {
    return files.map((file: IFile) => {
      return { ...file, justUploaded: false };
    });
  };

  return createPortal(
    <Blanket>
      <Grid gap="16px" padding="0px 0px 100px 0px">
        <StyledModal $smallScreen={isMobile}>
          <Stack alignItems="center" justifyContent="space-between">
            <Text type="headline" size="small">
              {title}
            </Text>
            <StyledContainerClose onClick={handleClose}>
              <Stack alignItems="center" gap="8px">
                <Text>{listModalData.close}</Text>
                <Icon
                  icon={<MdClear />}
                  size="24px"
                  cursorHover
                  appearance="dark"
                />
              </Stack>
            </StyledContainerClose>
          </Stack>
          <Divider />
          <StyledContainerContent $smallScreen={isMobile}>
            {typeof content === "string" ? (
              <Stack>
                <Text>{content}</Text>
              </Stack>
            ) : (
              <>
                {isViewing && (
                  <StyledContainerContent $smallScreen={isMobile}>
                    <Listdata
                      data={isViewing ? (dataDocument ?? []) : uploadedFiles}
                      icon={<MdOutlineRemoveRedEye />}
                      onPreview={handlePreview}
                    />
                  </StyledContainerContent>
                )}
              </>
            )}
          </StyledContainerContent>
          {optionButtons ? (
            <>
              <StyledAttachContainer
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                $isDragging={isDragging}
              >
                <Stack direction="column" alignItems="center">
                  <Text>{listModalData.drag}</Text>
                  <Text>{listModalData.or}</Text>
                </Stack>
                <Button spacing="compact" onClick={handleBrowseClick}>
                  {listModalData.search}
                </Button>
                <input
                  type="file"
                  accept="application/pdf,.jpg,.jpeg,.png"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                />
              </StyledAttachContainer>
              <Text size="medium" appearance="gray">
                {listModalData.maximum}
              </Text>
              {Array.isArray(pendingFiles) && pendingFiles.length > 0 ? (
                <>
                  <Divider dashed />
                  <Stack direction="column" gap="24px">
                    <Text
                      type="title"
                      size="medium"
                      weight="bold"
                      appearance="gray"
                    >
                      {listModalData.attachments}
                    </Text>
                    <Grid
                      templateColumns={isMobile ? "100%" : "auto auto"}
                      templateRows="repeat(60px)"
                      autoRows="repeat(auto-fit, minmax(250px, 1fr))"
                      gap="16px"
                      alignItems="center"
                    >
                      {pendingFiles.map(
                        (file, index) =>
                          !file.selectedToDelete && (
                            <File
                              key={file.id}
                              id={file.id}
                              index={index}
                              name={file.name}
                              size={formatFileSize(file.file.size)}
                              onDelete={() => {
                                onDeleteOneFile(file.id);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }}
                              uploadedFiles={uploadedFiles}
                              setSelectedDocument={setSelectedDocument}
                              setOpenViewer={setOpenViewer}
                              isMobile={isMobile}
                              handlePreview={handlePreview}
                              fileInputRef={fileInputRef}
                              pendingFiles={pendingFiles}
                              setOpenFlag={setOpenFlag}
                              isPendingFiles={file.justUploaded}
                              openFlag={openFlag}
                            />
                          ),
                      )}
                    </Grid>
                  </Stack>
                </>
              ) : (
                Array.isArray(uploadedFiles) &&
                uploadedFiles.length > 0 && (
                  <>
                    <Divider dashed />
                    <Stack direction="column" gap="24px">
                      <Text
                        type="title"
                        size="medium"
                        weight="bold"
                        appearance="gray"
                      >
                        {listModalData.attachments}
                      </Text>
                      <Grid
                        templateColumns={isMobile ? "100%" : "auto auto"}
                        templateRows="repeat(60px)"
                        autoRows="repeat(auto-fit, minmax(250px, 1fr))"
                        gap="16px"
                      >
                        {uploadedFiles.map(
                          (file, index) =>
                            !file.selectedToDelete && (
                              <File
                                key={file.id}
                                index={index}
                                id={file.id}
                                name={file.name}
                                size={
                                  file.file?.size
                                    ? formatFileSize(file.file.size)
                                    : "-"
                                }
                                onDelete={onDeleteOneFile}
                                uploadedFiles={uploadedFiles}
                                setSelectedDocument={setSelectedDocument}
                                setOpenViewer={setOpenViewer}
                                isMobile={isMobile}
                                handlePreview={handlePreview}
                                fileInputRef={fileInputRef}
                                pendingFiles={pendingFiles}
                                setOpenFlag={setOpenFlag}
                                isPendingFiles={file.justUploaded}
                                openFlag={openFlag}
                              />
                            ),
                        )}
                      </Grid>
                    </Stack>
                  </>
                )
              )}
              <Stack justifyContent="flex-end" margin="16px 0 0 0" gap="16px">
                <Button
                  onClick={handleCancel}
                  variant="outlined"
                  appearance="gray"
                  spacing="compact"
                >
                  {listModalData.buttonCancel}
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isDisabled()}
                  spacing="compact"
                >
                  {buttonLabel}
                </Button>
              </Stack>
            </>
          ) : (
            <Stack justifyContent="flex-end" margin="16px 0 0 0" gap="16px">
              <Button onClick={handleClose}>{buttonLabel}</Button>
            </Stack>
          )}
          {cancelButton && optionButtons && (
            <Stack justifyContent="flex-end" margin="16px 0 0 0" gap="16px">
              <Button
                variant="outlined"
                onClick={handleSubmit}
                spacing="wide"
                appearance={appearanceCancel}
              >
                {cancelButton}
              </Button>
              <Button onClick={onSubmit ?? handleClose}>{buttonLabel}</Button>
            </Stack>
          )}
          {openViewer && selectedDocument && (
            <DocumentViewer
              title={selectedDocument.name}
              selectedFile={selectedDocument.url}
              handleClose={() => {
                setOpenViewer(false);
                setSelectedDocument({ name: "", url: "" });
              }}
            />
          )}
        </StyledModal>
      </Grid>
    </Blanket>,
    node,
  );
};
