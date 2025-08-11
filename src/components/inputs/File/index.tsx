import { IDocumentUpload } from "@pages/applyForCredit/types";

import { FileUI } from "./interface";

interface FileProps {
  withBorder?: boolean;
  name: string;
  size: string;
  onDelete: (id: string) => void;
  uploadedFiles: IDocumentUpload[],
  setSelectedDocument: React.Dispatch<React.SetStateAction<{ name: string; url: string }>>;
  setOpenViewer: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean,
  handlePreview: (id: string, name: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  id: string;
  pendingFiles: IDocumentUpload[];
  index: number;
}

function File(props: FileProps) {
  const {
    withBorder = true,
    name,
    size,
    onDelete,
    handlePreview,
    isMobile,
    fileInputRef,
    id,
    pendingFiles,
    index
  } = props;

  return (
    <FileUI
      withBorder={withBorder}
      name={name}
      size={size}
      onDelete={onDelete}
      handlePreview={handlePreview}
      isMobile={isMobile}
      fileInputRef={fileInputRef}
      id={id}
      pendingFiles={pendingFiles}
      index={index}
    />
  );
}

export { File };
