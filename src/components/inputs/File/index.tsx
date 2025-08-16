import { useEffect, useState } from "react";

import { IFile } from "@components/modals/ListModal";

import { FileUI } from "./interface";

interface FileProps {
  name: string;
  size: string;
  isPendingFiles: boolean;
  openFlag: boolean;
  onDelete: (id: string) => void;
  uploadedFiles: IFile[];
  setSelectedDocument: React.Dispatch<
    React.SetStateAction<{ name: string; url: string }>
  >;
  setOpenViewer: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  handlePreview: (id: string, name: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  id: string;
  pendingFiles: IFile[];
  index: number;
  setOpenFlag: React.Dispatch<React.SetStateAction<boolean>>;
  withBorder?: boolean;
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
    openFlag,
    isPendingFiles,
  } = props;
  const [spinnerLoading, setSpinnerLoading] = useState(false);

  const handleDownloadWithFetch = () => {
    const url = URL.createObjectURL(pendingFiles[index].file);
    const link = document.createElement("a");

    link.href = url;
    link.download = pendingFiles[index].name;
    link.click();
    URL.revokeObjectURL(url);

    setOpenFlag(true);
  };

  useEffect(() => {
    if (!openFlag) return;

    const timerId = setTimeout(() => {
      setOpenFlag(false);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [openFlag]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (isPendingFiles) {
      setSpinnerLoading(true);

      timerId = setTimeout(() => {
        setSpinnerLoading(false);
      }, 500);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [isPendingFiles]);

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
      spinnerLoading={spinnerLoading}
    />
  );
}

export { File };
