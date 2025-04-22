import { useRef, useState, useContext } from "react";
import { createPortal } from "react-dom";
import { MdClear, MdOutlineCloudUpload } from "react-icons/md";

import { Blanket } from "@inubekit/blanket";
import { Button } from "@inubekit/button";
import {
  Stack,
  Icon,
  Text,
  useFlag,
  useMediaQuery,
  Divider,
} from "@inubekit/inubekit";

import { optionFlags } from "@pages/prospect/outlets/financialReporting/config";
import { saveDocument } from "@services/saveDocument";
import { validationMessages } from "@validations/validationMessages";
import { AppContext } from "@context/AppContext";
import { IDocumentUpload } from "@pages/SubmitCreditApplication/types";
import { File } from "@components/inputs/File";
import { formatFileSize } from "@utils/size";

import {
  StyledAttachContainer,
  StyledContainerClose,
  StyledContainerContent,
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
  const dragCounter = useRef(0);
  const MAX_FILE_SIZE = 2.5 * 1024 * 1024;

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!setUploadedFiles) return;
    if (files && files.length > 0 && onlyDocumentReceived) {
      const newFiles = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        file: file,
      }));
      setUploadedFiles(newFiles);
    } else if (files) {
      const newFiles = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        file: file,
      }));
      setUploadedFiles(
        (prev: { id: string; name: string; file: File }[] | null) => [
          ...(prev || []),
          ...newFiles,
        ],
      );
    } else {
      setUploadedFiles([]);
    }
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
    if (uploadMode === "local") {
      console.log("Archivos guardados en estado:", uploadedFiles);
      handleClose();
      return;
    }
    try {
      if (uploadedFiles) {
        for (const fileData of uploadedFiles) {
          await saveDocument(
            businessUnitPublicCode,
            id,
            fileData.name.split(".").slice(0, -1).join("."),
            fileData.file,
          );
        }
      }

      setUploadedFiles?.([]);
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
      return uploadedFiles?.length !== 1;
    }
    return !uploadedFiles?.length || uploadedFiles.length < 1;
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
            setUploadedFiles([newFile]);
          } else {
            setUploadedFiles(
              (prev: { id: string; name: string; file: File }[] | null) => [
                ...(prev || []),
                newFile,
              ],
            );
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
          {typeof content === "string" && (
            <Stack>
              <Text>{content}</Text>
            </Stack>
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
                accept="application/pdf"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </StyledAttachContainer>
            <Text size="medium" appearance="gray">
              {listModalData.maximum}
            </Text>
            {Array.isArray(uploadedFiles) && uploadedFiles.length > 0 && (
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
                      size={formatFileSize(file.file.size)}
                      onDelete={() => {
                        setUploadedFiles?.([]);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    />
                  ))}
                </Stack>
              </>
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
      </StyledModal>
    </Blanket>,
    node,
  );
};
