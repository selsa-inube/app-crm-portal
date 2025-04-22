import styled from "styled-components";
import { inube } from "@inubekit/inubekit";
interface IStyledContainerCardInfo {
  $containerHeight?: string;
  $isMobile?: boolean;
}

export const StyledContainerCardInfo = styled.div<IStyledContainerCardInfo>`
  overflow-y: ${({ $isMobile }) => ($isMobile ? "hidden" : "auto")};
  border-radius: 8px;
  border-width: 2px;
  border-style: solid;
  height: ${({ $containerHeight }) => $containerHeight};
  border-color: ${({ theme }) =>
    theme?.palette?.blue?.B400 || inube.palette.blue.B400};
  box-shadow: 0px 2px 6px
    ${({ theme }) => theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
  padding: ${({ $isMobile }) => ($isMobile ? "8px" : "16px")};

  ${({ $isMobile, theme }) =>
    !$isMobile &&
    `
    &::-webkit-scrollbar {
      width: 8px;  
      border-radius: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${
        theme?.palette?.neutral?.N30 || inube.palette.neutral.N30
      };
      border-radius: 8px;
    }
  `}
`;
