import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { MdClear, MdOutlineCloudUpload } from "react-icons/md";
import { Icon, Stack, Text, useMediaQuery, Blanket, Divider, Button } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";
import { formatFileSize } from "@utils/size";

import { File } from "../../components/File";
import { StyledModal, StyledContainerClose, StyledAttachContainer } from "./styles";

export interface AttachDocumentModalProps {
  portalId?: string;
  onAttach?: (file: File) => void;
  onCloseModal?: () => void;
}

export function AttachDocumentModal(props: AttachDocumentModalProps) {
  const { portalId = "portal", onAttach, onCloseModal } = props;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const MAX_FILE_SIZE = 2.5 * 1024 * 1024;

  const isMobile = useMediaQuery("(max-width: 700px)");
  const portalNode = document.getElementById(portalId);

  if (!portalNode) {
    throw new Error("The portal node is not defined. Ensure the specific node exists in the DOM.");
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        if (file.size <= MAX_FILE_SIZE) {
          setSelectedFile(file);
        } else {
          alert("El archivo supera el tamaño máximo permitido de 2.5MB.");
        }
      } else {
        alert("Solo se permiten archivos PDF.");
      }
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        if (file.size <= MAX_FILE_SIZE) {
          setSelectedFile(file);
        } else {
          alert("El archivo supera el tamaño máximo permitido de 2.5MB.");
        }
      } else {
        alert("Solo se permiten archivos PDF.");
      }
      e.dataTransfer.clearData();
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return createPortal(
    <Blanket>
      <StyledModal $smallScreen={isMobile} $selectedFile={!!selectedFile}>
        <Stack alignItems="center" justifyContent="space-between">
          <Text type="headline" size="small">
            Adjuntar hoja de vida
          </Text>
          <StyledContainerClose onClick={onCloseModal}>
            <Stack alignItems="center" gap={spacing.s100}>
              <Text>Cerrar</Text>
              <Icon icon={<MdClear />} size="24px" cursorHover appearance="dark" />
            </Stack>
          </StyledContainerClose>
        </Stack>
        <Divider />
        <StyledAttachContainer
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          $isDragging={isDragging}
        >
          <Icon icon={<MdOutlineCloudUpload />} appearance="gray" size="32px" />
          <Stack direction="column" alignItems="center">
            <Text>Arrastra un documento</Text>
            <Text>o</Text>
          </Stack>
          <Button spacing="compact" onClick={handleBrowseClick}>
            Busca un documento
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
          Peso máximo por archivo: 2.5MB
        </Text>
        {selectedFile && (
          <>
            <Divider dashed />
            <Stack direction="column" gap={spacing.s300}>
              <Text type="title" size="medium" weight="bold" appearance="gray">
                Documentos adjuntos
              </Text>
              <File
                name={selectedFile.name}
                size={formatFileSize(selectedFile.size)}
                onDelete={() => setSelectedFile(null)}
              />
            </Stack>
          </>
        )}
        <Stack alignItems="flex-end" justifyContent="flex-end" gap={spacing.s250}>
          <Button onClick={onCloseModal} variant="outlined" appearance="gray">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (onAttach && selectedFile) {
                onAttach(selectedFile);
              }
            }}
            disabled={!selectedFile}
          >
            Adjuntar
          </Button>
        </Stack>
      </StyledModal>
    </Blanket>,
    portalNode,
  );
}
