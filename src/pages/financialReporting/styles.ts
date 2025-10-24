import styled, { createGlobalStyle, css } from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IGlobalPdfStylesProps {
  $isGeneratingPdf?: boolean;
}

export const StyledItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid
    ${({ theme }) => theme.palette?.neutral?.N40 || inube.palette.neutral.N40};
`;
export const StyledMessageContainer = styled.div`
  position: fixed;
  bottom: 18px;
  right: 75px;
  z-index: 2;
`;

interface IStyledToast {
  $isMobile: boolean;
}

export const StyledToast = styled.div<IStyledToast>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 2;
  position: absolute;
  gap: 4px;
  opacity: ${({ $isMobile }) => ($isMobile ? "1" : "0.8")};
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

export const StyledScreenPrint = styled.div<IStyledToast>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) =>
    $isMobile ? "1fr" : "repeat(2, 1fr)"};
  gap: 16px;

  @media print {
    display: grid;
    grid-template-columns: 1fr;
    gap: 35px;
  }

  & > div:nth-child(2),
  & > div:nth-child(3),
  & > div:nth-child(5),
  & > div:nth-child(6) {
    @media print {
      height: 100%;
    }
  }

  & > div:nth-child(2) {
    @media print {
      margin-top: 35px;
    }
  }
`;

export const StyledPageBreak = styled.div`
  @media print {
    page-break-before: always;
  }
`;

export const StyledMarginPrint = styled.div<IStyledToast>`
  margin: ${({ $isMobile }) => ($isMobile ? "20px" : "20px 40px")};
  @media print {
    @page {
      margin: 1in 0.85in 1in 1in;
    }
    margin: -15px 0 0 0;
  }
`;

interface IStyledHorizontalDivider {
  $isMobile?: boolean;
}

export const StyledHorizontalDivider = styled.hr<IStyledHorizontalDivider>`
  margin: 0px;
  width: 2px;
  border: none;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
  display: ${({ $isMobile }) => ($isMobile ? "none" : "block")};
`;

export const StyledTextField = styled.div`
  @media (min-width: 800px) {
    white-space: nowrap;
    overflow: hidden;
    max-width: 230px;
  }
`;

export const StyledContainerSpinner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const BlockPdfSection = styled.div`
  width: inherit;
  height: inherit;
`;

export const GlobalPdfStyles = createGlobalStyle<IGlobalPdfStylesProps>`
  ${({ $isGeneratingPdf }) =>
    $isGeneratingPdf &&
    css`
      .pdf-generation-mode,
      .pdf-generation-mode * {
        overflow: visible !important;
        height: auto !important;
        max-height: none !important;
        flex-shrink: 0 !important;
        box-shadow: none !important;
      }

      .pdf-generation-mode {
        background-color: white !important;
      }
    `}
`;
