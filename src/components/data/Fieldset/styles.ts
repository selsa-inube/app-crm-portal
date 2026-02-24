import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledContainerFieldset {
  $isSelected: boolean;
  $isMobile: boolean;
  $aspectRatio?: string;
  $hasOverflow?: boolean;
  $isClickable?: boolean;
  $hasTable: boolean;
  $height?: string;
  $borderColor?: string;
  $showFieldset?: boolean;
  $alignContent?: string;
  $maxHeight?: string;
}

export const StyledContainerFieldset = styled.div<IStyledContainerFieldset>`
  align-content: ${({ $alignContent }) =>
    $alignContent ? "center" : "normal"};
  cursor: ${({ $isClickable }) => ($isClickable ? "pointer" : "auto")};
  overflow-y: ${({ $hasOverflow }) => ($hasOverflow ? "visible" : "auto")};
  box-sizing: border-box;
  height: ${({ $height }) => $height};
  max-height: ${({ $maxHeight }) => $maxHeight};
  border-radius: 8px;
  border: ${({ $showFieldset }) => ($showFieldset ? "1px solid" : "none")};
  padding-top: ${({ $hasTable }) => !$hasTable && "16px"};
  padding-bottom: ${({ $hasTable }) => !$hasTable && "16px"};
  padding-right: ${({ $hasTable }) => !$hasTable && "8px"};
  padding-left: ${({ $hasTable }) => !$hasTable && "8px"};
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio};
  background-color: ${({ theme, $isSelected }) =>
    !$isSelected
      ? theme?.palette?.neutral?.N0 || inube.palette.neutral.N0
      : theme?.palette?.blue?.B50 || inube.palette.blue.B50};
  border-color: ${({ theme, $borderColor, $isSelected }) => {
    if ($isSelected) {
      return theme?.palette?.blue?.B300 || inube.palette.blue.B300;
    }
    switch ($borderColor) {
      case "blue":
        return theme?.palette?.blue?.B300 || inube.palette.blue.B300;
      case "gray":
        return theme?.palette?.neutral?.N300 || inube.palette.neutral.N300;
      case "normal":
      default:
        return theme?.palette?.neutral?.N40 || inube.palette.neutral.N40;
    }
  }};
  box-shadow: ${({ theme, $isSelected }) =>
    $isSelected &&
    `-12px 0px 0px ${theme?.palette?.blue?.B400 || inube.palette.blue.B400}`};
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;

  ${({ $isMobile, theme }) =>
    !$isMobile &&
    `
    &::-webkit-scrollbar {
      width: 8px; 
      border-radius: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${
        theme?.palette?.neutral?.N50 || inube.palette.neutral.N50
      };
      border-radius: 8px;
    }
  `}
`;

export const StyledPrint = styled.div`
  @media print {
    display: none;
  }
`;
