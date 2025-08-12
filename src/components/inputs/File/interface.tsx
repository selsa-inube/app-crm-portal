import { Icon, Stack, Text } from "@inubekit/inubekit";
import {
  MdOutlineDescription,
  MdOutlineDelete,
  MdOutlineRemoveRedEye,
  MdOutlineFileDownload,
} from "react-icons/md";

import { IDocumentUpload } from "@pages/applyForCredit/types";

import { StyledFile } from "./styles";

interface FileUIProps {
  withBorder?: boolean;
  name: string;
  size: string;
  onDelete: (id: string) => void;
  handlePreview: (id: string, name: string, pendingFile?: File) => void;
  dataDocument?: { id: string; name: string }[];
  uploadedFiles?: IDocumentUpload[];
  isViewing?: boolean;
  isMobile: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  id: string;
  pendingFiles: IDocumentUpload[];
  index: number;
  handleDownloadWithFetch: () => void;
}

function FileUI(props: FileUIProps) {
  const {
    withBorder,
    name,
    id,
    size,
    onDelete,
    handlePreview,
    pendingFiles,
    index,
    isMobile,
    handleDownloadWithFetch,
  } = props;

  return (
    <StyledFile $withBorder={withBorder} isMobile={isMobile}>
      <Stack gap="8px" alignItems="center">
        <Icon icon={<MdOutlineDescription />} appearance="dark" size="20px" />
        <Stack direction="column" width={isMobile ? "160px" : "130px"}>
          <Text type="label" size="medium" weight="bold" ellipsis>
            {name}
          </Text>
          <Text appearance="gray" size="small">
            {size}
          </Text>
        </Stack>
      </Stack>
      <Stack direction="row" gap="8px">
        {isMobile ? (
          <Icon
            icon={<MdOutlineFileDownload />}
            cursorHover
            appearance="dark"
            size="20px"
            onClick={handleDownloadWithFetch}
          />
        ) : (
          <Icon
            icon={<MdOutlineRemoveRedEye />}
            cursorHover
            appearance="dark"
            size="20px"
            onClick={() => {
              handlePreview(id, name, pendingFiles[index]?.file);
            }}
          />
        )}
        <Icon
          icon={<MdOutlineDelete />}
          cursorHover
          appearance="danger"
          size="20px"
          onClick={() => {
            onDelete(id);
          }}
        />
      </Stack>
    </StyledFile>
  );
}

export { FileUI };
