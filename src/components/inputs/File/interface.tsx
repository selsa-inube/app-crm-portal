import { Icon, Stack, Text } from "@inubekit/inubekit";
import { MdOutlineDescription, MdOutlineDelete, MdOutlineRemoveRedEye } from "react-icons/md";

import { StyledContainerContent } from "@components/modals/ListModal/styles";

import { StyledFile } from "./styles";

interface FileUIProps {
  withBorder?: boolean;
  name: string;
  size: string;
  onDelete?: () => void;
  handlePreview: (id: string, name: string) => void;
}

function FileUI(props: FileUIProps) {
  const { withBorder, name, size, onDelete, handlePreview } = props;
  return (
    <StyledFile $withBorder={withBorder}>
      <Stack gap="8px" alignItems="center">
        <Icon icon={<MdOutlineDescription />} appearance="dark" size="20px" />
        <Stack direction="column" width="170px">
          <Text type="label" size="medium" weight="bold" ellipsis>
            {name}
          </Text>
          <Text appearance="gray" size="small">
            {size}
          </Text>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        gap="8px"
      >
        <StyledContainerContent $smallScreen={isMobile}>
          <Listdata
            data={isViewing ? (dataDocument ?? []) : uploadedFiles}
            icon={<MdOutlineRemoveRedEye />}
            onPreview={handlePreview}
          />
        </StyledContainerContent>
        <Icon
          icon={<MdOutlineDelete />}
          cursorHover
          appearance="danger"
          size="20px"
          onClick={onDelete}
        />
      </Stack>
    </StyledFile>
  );
}

export { FileUI };
