import { IDocumentUpload } from "@pages/applyForCredit/types";

import { FileUI } from "./interface";

interface FileProps {
  withBorder?: boolean;
  name: string;
  size: string;
  onDelete?: () => void;
  uploadedFiles: IDocumentUpload[],
  setSelectedDocument: React.Dispatch<React.SetStateAction<{ name: string; url: string }>>;
  setOpenViewer: React.Dispatch<React.SetStateAction<boolean>>;
}

function File(props: FileProps) {
  const {
    withBorder = true,
    name,
    size,
    onDelete,
    uploadedFiles,
    setSelectedDocument,
    setOpenViewer } = props;

  const handlePreview = (id: string, name: string) => {
    const fileData = uploadedFiles?.find((file) => file.id === id);

    if (!fileData || !fileData.file) return;

    const url = URL.createObjectURL(fileData.file);

    setSelectedDocument({ name, url });
    setOpenViewer(true);
  };

  return (
    <FileUI
      withBorder={withBorder}
      name={name}
      size={size}
      onDelete={onDelete}
      handlePreview={handlePreview}
    />
  );
}

export { File };
