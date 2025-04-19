import { useState } from "react";

import { FileAttachmentUI } from "./interface";
import { AttachDocumentModal } from "../../modals/AttachDocumentModal";
import { DeleteAttachModal } from "../../modals/DeleteAttachModal";

interface FileAttachmentProps {
  attachedFile?: File;
  onFileChange: (file: File | undefined) => void;
}

function FileAttachment(props: FileAttachmentProps) {
  const { attachedFile, onFileChange } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAttach = (file: File) => {
    onFileChange(file);
    setIsModalOpen(false);
  };

  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDelete = () => {
    onFileChange(undefined);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <FileAttachmentUI
        onAttach={handleOpenModal}
        attachedFile={attachedFile}
        onDelete={handleOpenDeleteModal}
      />
      {isModalOpen && (
        <AttachDocumentModal onCloseModal={handleCloseModal} onAttach={handleAttach} />
      )}
      {isDeleteModalOpen && (
        <DeleteAttachModal onCloseModal={handleCloseDeleteModal} onDelete={handleDelete} />
      )}
    </>
  );
}

export { FileAttachment };
