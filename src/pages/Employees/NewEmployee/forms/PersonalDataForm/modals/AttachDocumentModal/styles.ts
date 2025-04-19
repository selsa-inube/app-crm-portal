import styled from "styled-components";
import { inube } from "@inubekit/inubekit";
import { spacing } from "@design/tokens/spacing";

interface IStyledModal {
  $smallScreen: boolean;
  $selectedFile: boolean;
  theme?: typeof inube;
}

interface IStyledAttachContainer {
  $isDragging?: boolean;
  theme?: typeof inube;
}

const StyledModal = styled.div<IStyledModal>`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  background-color: ${({ theme }) => theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  height: ${({ $smallScreen, $selectedFile }) =>
    $smallScreen ? ($selectedFile ? "490px" : "346px") : $selectedFile ? "500px" : "362px"};
  width: ${({ $smallScreen }) => ($smallScreen ? "311px" : "502px")};
  padding: ${({ $smallScreen }) =>
    $smallScreen ? spacing.s150 : `${spacing.s200} ${spacing.s300}`};
  gap: ${spacing.s200};
  border-radius: ${spacing.s200};

  textarea {
    resize: none;
  }
`;

const StyledContainerClose = styled.div`
  cursor: pointer;
`;

const StyledAttachContainer = styled.div<IStyledAttachContainer>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 188px;
  gap: ${spacing.s200};
  border-radius: ${spacing.s100};
  border: 2px dashed
    ${({ theme, $isDragging }) =>
      $isDragging
        ? theme?.palette?.blue?.B300 || inube.palette.blue.B300
        : theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  background-color: ${({ theme, $isDragging }) =>
    $isDragging
      ? theme?.palette?.blue?.B50 || inube.palette.blue.B50
      : theme?.palette?.neutral.N0 || theme?.palette?.neutral.N0};
  transition: border 0.3s ease;
`;

export { StyledModal, StyledContainerClose, StyledAttachContainer };
