import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledModal {
  $smallScreen: boolean;
}

interface IStyledAttachContainer {
  $isDragging?: boolean;
  theme?: typeof inube;
}

export const StyledItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid
    ${({ theme }) => theme.palette?.neutral?.N40 || inube.palette.neutral.N40};
`;

export const StyledModal = styled.div<IStyledModal>`
  display: flex;
  flex-direction: column;
  width: ${({ $smallScreen }) => ($smallScreen ? "300px" : "510px")};
  background-color: ${({ theme }) =>
    theme.palette?.neutral?.N0 || inube.palette.neutral.N0};
  padding: ${({ $smallScreen }) => ($smallScreen ? "16px" : "24px")};
  gap: ${({ $smallScreen }) => ($smallScreen ? "16px" : "24px")};
  border-radius: 8px;
`;
export const StyledContainerContent = styled.div<IStyledModal>`
  display: flex;
  flex-direction: column;
  padding-top: 4px;
  padding-right: 4px;
  padding-bottom: 4px;
  padding-left: 4px;
`;

export const StyledAttachContainer = styled.div<IStyledAttachContainer>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 188px;
  gap: 16px;
  border-radius: 8px;
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

export const StyledContainerClose = styled.div`
  cursor: pointer;
`;

export const StyledDocuments = styled.ul`
  padding-inline-start: 2px;
  margin-block: 8px;
`;
