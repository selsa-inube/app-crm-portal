import { useRef, useState, useContext } from "react";
import { createPortal } from "react-dom";
import {
  MdClear,
  MdOutlineCloudUpload,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import {
  Stack,
  Icon,
  Text,
  useFlag,
  useMediaQuery,
  Divider,
  Blanket,
  Button,
} from "@inubekit/inubekit";

import { optionFlags } from "@pages/prospect/outlets/financialReporting/config";
import { saveDocument } from "@services/saveDocument";
import { validationMessages } from "@validations/validationMessages";
import { AppContext } from "@context/AppContext";
import { IDocumentUpload } from "@pages/applyForCredit/types";
import { File } from "@components/inputs/File";
import { formatFileSize } from "@utils/size";

import { DocumentViewer } from "../DocumentViewer";
import {
  StyledAttachContainer,
  StyledContainerClose,
  StyledContainerContent,
  StyledItem,
  StyledModal,
} from "./styles";
import { listModalData } from "./config";
import { truncateTextToMaxLength } from "@src/utils/formatData/text";

export interface IOptionButtons {
  label: string;
  variant: "filled" | "outlined" | "none";
  icon?: React.JSX.Element;
  fullwidth?: boolean;
  onClick?: () => void;
}

export interface IListModalProps {
  title: string;
  buttonLabel: string;
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
  uploadedFiles?: IDocumentUpload[];
  onlyDocumentReceived?: boolean;
  handleClose: () => void;
  handleSubmit?: () => void;
  onSubmit?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUploadedFiles?: React.Dispatch<React.SetStateAction<any>>;
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

  const node = document.getElementById(portalId ?? "portal");
  if (!node) {
    throw new Error(validationMessages.errorNodo);
  }
  const { addFlag } = useFlag();

  const isMobile = useMediaQuery("(max-width: 700px)");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { businessUnitSigla } = useContext(AppContext);

  const [isDragging, setIsDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<
    { id: string; name: string; file: File }[]
  >([]);
  const [openViewer, setOpenViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string;
    url: string;
  } | null>(null);

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
    }));

    setPendingFiles(newFiles);
  };

  interface IListdataProps {
    data: { id: string; name: string }[] | null | undefined;
    onDelete?: (id: string) => void;
    icon?: React.ReactNode;
    onPreview?: (id: string, name: string) => void;
  }

  const Listdata = (props: IListdataProps) => {
    const { data, icon, onDelete, onPreview } = props;

    const maxLength = isMobile ? 20 : 40;

    return (
      <ul
        style={{
          paddingInlineStart: "2px",
          marginBlock: "8px",
        }}
      >
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
      </ul>
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
    if (!setUploadedFiles) return;

    if (uploadMode === "local") {
      console.log("Archivos guardados en estado:", uploadedFiles);
      setUploadedFiles(pendingFiles);
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

      setUploadedFiles([]);
      setPendingFiles([]);
      handleClose();
      handleFlag(
        optionFlags.title,
        optionFlags.description,
        optionFlags.appearance as FlagAppearance,
      );
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
          };
          if (onlyDocumentReceived) {
            setPendingFiles([newFile]);
          } else {
            setPendingFiles((prev) => [...prev, newFile]);
          }
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

  const handlePreview = (id: string, name: string) => {
    const fileData = uploadedFiles?.find((file) => file.id === id);

    if (!fileData || !fileData.file) return;

    const url = URL.createObjectURL(fileData.file);

    setSelectedDocument({ name, url });
    setOpenViewer(true);
  };

  return createPortal(
    <Blanket>
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
              <Icon
                icon={<MdOutlineCloudUpload />}
                appearance="gray"
                size="32px"
              />
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
                  {pendingFiles.map((file) => (
                    <File
                      key={file.id}
                      name={file.name}
                      size={formatFileSize(file.file.size)}
                      onDelete={() => {
                        setPendingFiles([]);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    />
                  ))}
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
                    {uploadedFiles.map((file) => (
                      <File
                        key={file.id}
                        name={file.name}
                        size={
                          file.file?.size ? formatFileSize(file.file.size) : "-"
                        }
                        onDelete={() => {
                          setUploadedFiles?.([]);
                        }}
                      />
                    ))}
                  </Stack>
                </>
              )
            )}
            <Stack justifyContent="flex-end" margin="16px 0 0 0" gap="16px">
              <Button onClick={handleUpload} disabled={isDisabled()}>
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
              setSelectedDocument(null);
            }}
          />
        )}
      </StyledModal>
    </Blanket>,
    node,
  );
};
