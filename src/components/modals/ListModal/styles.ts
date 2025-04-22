import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledModal {
  $smallScreen: boolean;
}

export const StyledModal = styled.div<IStyledModal>`
  overflow: auto;
  display: flex;
  flex-direction: column;
  max-height: ${({ $smallScreen }) => ($smallScreen ? "398px" : "382px")};
  width: ${({ $smallScreen }) => ($smallScreen ? "335px" : "430px")};
  background-color: ${({ theme }) =>
    theme.color?.surface?.light?.clear || inube.palette.neutral.N0};
  padding: ${({ $smallScreen }) => ($smallScreen ? "16px" : "24px")};
  gap: ${({ $smallScreen }) => ($smallScreen ? "16px" : "24px")};
  border-radius: 8px;
`;
export const StyledContainerContent = styled.div<IStyledModal>`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 4px;
  padding-right: 4px;
  padding-bottom: 4px;
  padding-left: 4px;

  ${({ $smallScreen, theme }) =>
    !$smallScreen &&
    `
    &::-webkit-scrollbar {
      width: 16px;
      height: 75px;
      border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${
        theme?.color?.surface?.gray?.regular || inube.palette.neutral.N30
      };
      border-radius: 8px;
    }
  `}
`;

export const StyledContainerClose = styled.div`
  cursor: pointer;
`;
