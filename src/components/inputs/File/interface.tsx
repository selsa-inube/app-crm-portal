import { Icon, Stack, Text, Spinner } from "@inubekit/inubekit";
import {
  MdOutlineDescription,
  MdOutlineDelete,
  MdOutlineRemoveRedEye,
  MdOutlineFileDownload,
} from "react-icons/md";

import { IFile } from "@components/modals/ListModal";

import { StyledFile } from "./styles";

interface FileUIProps {
  withBorder?: boolean;
  name: string;
  size: string;
  isMobile: boolean;
  id: string;
  index: number;
  spinnerLoading: boolean;
  pendingFiles: IFile[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  onDelete: (id: string) => void;
  handleDownloadWithFetch: () => void;
  handlePreview: (id: string, name: string, pendingFile?: File) => void;
  dataDocument?: { id: string; name: string }[];
  uploadedFiles?: IFile[];
  isViewing?: boolean;
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
    spinnerLoading,
  } = props;

  return (
    <StyledFile
      $withBorder={withBorder}
      isMobile={isMobile}
      spinnerLoading={spinnerLoading}
    >
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
      <Stack direction="row" gap="8px" width="40px">
        {!spinnerLoading ? (
          <>
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
          </>
        ) : (
          <Spinner size="small" />
        )}
      </Stack>
    </StyledFile>
  );
}

export { FileUI };
