import { createPortal } from "react-dom";
import { MdClear } from "react-icons/md";
import { Text, Stack, Icon, useMediaQuery, Blanket } from "@inubekit/inubekit";
import { validationMessages } from "@validations/validationMessages";
import {
  StyledContainerClose,
  StyledModal,
} from "@components/modals/ListModal/styles";

export interface IDocumentViewerProps {
  selectedFile: string;
  handleClose?: () => void;
  portalId?: string;
  open?: boolean;
  isMobile?: boolean;
  title: string;
}

export const DocumentViewer = (props: IDocumentViewerProps) => {
  const { portalId, selectedFile, handleClose, title } = props;
  const node = document.getElementById(portalId ?? "portal");

  if (!node) {
    throw new Error(validationMessages.errorNodo);
  }
  const isMobile = useMediaQuery("(max-width: 700px)");

  return createPortal(
    <Blanket>
      <StyledModal $smallScreen={isMobile}>
        <Stack alignItems="center" justifyContent="space-between">
          <Text type="headline" size="small">
            {title}
          </Text>
          <StyledContainerClose onClick={handleClose}>
            <Stack alignItems="center" gap="8px">
              <Text>Cerrar</Text>
              <Icon
                icon={<MdClear />}
                size="24px"
                cursorHover
                appearance="dark"
                onClick={handleClose}
              />
            </Stack>
          </StyledContainerClose>
        </Stack>
        {selectedFile && (
          <iframe src={selectedFile} width="100%" height="auto"></iframe>
        )}
      </StyledModal>
    </Blanket>,
    node,
  );
};
