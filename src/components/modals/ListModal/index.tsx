import { useRef, useState, useContext } from "react";
import { createPortal } from "react-dom";
import {
  MdClear,
  MdDeleteOutline,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { useAuth0 } from "@auth0/auth0-react";

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

import { StyledItem } from "@pages/board/outlets/financialReporting/styles";
import { optionFlags } from "@pages/board/outlets/financialReporting/config";
import { saveDocument } from "@services/saveDocument";
import { validationMessages } from "@validations/validationMessages";
import { AppContext } from "@context/AppContext";
import { getSearchDocumentById } from "@services/documents/SearchDocumentById";
import { IDocumentUpload } from "@pages/SubmitCreditApplication/types";

import {
  StyledContainerClose,
  StyledContainerContent,
  StyledModal,
} from "./styles";
import { DocumentViewer } from "../DocumentViewer";
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

  const { user } = useAuth0();
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  interface IListdataProps {
    data: { id: string; name: string }[] | null | undefined;
    onDelete?: (id: string) => void;
    icon?: React.ReactNode;
    onPreview?: (id: string, name: string) => void;
  }

  const Listdata = (props: IListdataProps) => {
    const { data, icon, onDelete, onPreview } = props;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return <Text>{listModalData.noDocuments}</Text>;
    }

    return (
      <ul
        style={{
          paddingInlineStart: "2px",
          marginBlock: "8px",
        }}
      >
        {data.map((element) => (
          <StyledItem key={element.id}>
            <Text>{element.name}</Text>
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

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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

  const handleDeleteFile = (id: string) => {
    if (!setUploadedFiles) return;
    setUploadedFiles(
      (prev: { id: string; name: string; file: File }[] | null) =>
        (prev || []).filter((file) => file.id !== id),
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

  const handlePreview = async (id: string, name: string) => {
    try {
      const documentData = await getSearchDocumentById(
        id,
        user?.email ?? "",
        businessUnitPublicCode,
      );
      const fileUrl = URL.createObjectURL(documentData);
      setSelectedFile(fileUrl);
      setFileName(name);
      setOpen(true);
    } catch (error) {
      console.error("Error obteniendo el documento:", error);
    }
  };

  const isDisabled = () => {
    if (onlyDocumentReceived) {
      return uploadedFiles?.length !== 1;
    }
    return !uploadedFiles?.length || uploadedFiles.length < 1;
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
              <Text>Cerrar</Text>
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
            <StyledContainerContent $smallScreen={isMobile}>
              <Listdata
                data={isViewing ? (dataDocument ?? []) : uploadedFiles}
                icon={
                  isViewing ? <MdOutlineRemoveRedEye /> : <MdDeleteOutline />
                }
                onDelete={!isViewing ? handleDeleteFile : undefined}
                onPreview={isViewing ? handlePreview : undefined}
              />
            </StyledContainerContent>
          )}
        </StyledContainerContent>
        {optionButtons ? (
          <>
            <Button
              spacing="compact"
              iconBefore={optionButtons?.icon}
              variant={optionButtons?.variant}
              onClick={handleButtonClick}
              fullwidth={optionButtons?.fullwidth}
              cursorHover
            >
              {optionButtons?.label}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.png"
              multiple={uploadMode === "local" ? false : true}
            />
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
        {selectedFile && open && (
          <DocumentViewer
            selectedFile={selectedFile}
            handleClose={() => setOpen(false)}
            title={fileName || ""}
          />
        )}
      </StyledModal>
    </Blanket>,
    node,
  );
};
