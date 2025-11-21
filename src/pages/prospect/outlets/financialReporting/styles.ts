import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

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
    overflow-y: visible !important;
    height: auto !important;
    width: 100% !important;
  }

  & > div:nth-child(2),
  & > div:nth-child(3),
  & > div:nth-child(5),
  & > div:nth-child(6) {
    @media print {
      height: 100%;
      overflow-y: visible !important;
      height: auto !important;
      width: 100% !important;
    }
  }

  & > div:nth-child(2) {
    @media print {
      margin-top: 35px;
      overflow-y: visible !important;
      height: auto !important;
      width: 100% !important;
    }
  }
`;

export const StyledPageBreak = styled.div`
  @media print {
    page-break-before: always;
    overflow-y: visible !important;
    height: auto !important;
    width: 100% !important;
  }
`;

export const StyledMarginPrint = styled.div<IStyledToast>`
  margin: ${({ $isMobile }) => ($isMobile ? "20px" : "20px 40px")};
  @media print {
    @page {
      margin: 1in 0.85in 1in 1in;
    }
    overflow-y: visible !important;
    height: auto !important;
    width: 100% !important;
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
  white-space: nowrap;
  overflow: hidden;
  max-width: 230px;
`;
