import { IDocumentUpload } from "@pages/applyForCredit/types";

import { FileUI } from "./interface";

interface FileProps {
  withBorder?: boolean;
  name: string;
  size: string;
  onDelete: (id: string) => void;
  uploadedFiles: IDocumentUpload[];
  setSelectedDocument: React.Dispatch<
    React.SetStateAction<{ name: string; url: string }>
  >;
  setOpenViewer: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  handlePreview: (id: string, name: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  id: string;
  pendingFiles: IDocumentUpload[];
  index: number;
  setOpenFlag: React.Dispatch<React.SetStateAction<boolean>>;
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
    index,
    setOpenFlag,
  } = props;

  const handleDownloadWithFetch = () => {
    const url = URL.createObjectURL(pendingFiles[index].file);
    const link = document.createElement("a");

    link.href = url;
    link.download = pendingFiles[index].name;
    link.click();
    URL.revokeObjectURL(url);

    setOpenFlag(true);
    setTimeout(() => {
      setOpenFlag(false);
    }, 10000);
  };

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
      handleDownloadWithFetch={handleDownloadWithFetch}
    />
  );
}

export { File };
