import { Divider, Stack, Text } from "@inubekit/inubekit";

import { formatFileSize } from "@utils/size";

import { File } from "../File";
import { StyledFileAttachment } from "./styles";

interface FileAttachmentUIProps {
  onAttach: () => void;
  attachedFile?: File;
  onDelete: () => void;
}

function FileAttachmentUI(props: FileAttachmentUIProps) {
  const { onAttach, attachedFile, onDelete } = props;

  return (
    <StyledFileAttachment $attachedFile={attachedFile}>
      <Stack justifyContent="space-between">
        <Text type="label">Hoja de vida - Empleado</Text>
        <Text
          type="label"
          weight="bold"
          appearance="primary"
          onClick={onAttach}
          disabled={!!attachedFile}
          cursorHover
        >
          Adjuntar
        </Text>
      </Stack>
      {attachedFile && (
        <>
          <Divider dashed />
          <File
            name={attachedFile.name}
            size={formatFileSize(attachedFile.size)}
            withBorder={false}
            onDelete={onDelete}
          />
        </>
      )}
    </StyledFileAttachment>
  );
}

export { FileAttachmentUI };
