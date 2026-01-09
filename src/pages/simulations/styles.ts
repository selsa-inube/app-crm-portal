import styled from "styled-components";

export const StyledPrint = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media print {
    display: none;
  }
`;

export const StyledArrowBack = styled.div`
  cursor: pointer;
  width: 500px;
`;

export const StyledMarginPrint = styled.div`
  @media print {
    gap: 0px !important;
    min-width: 100% !important;
    height: auto !important;
    overflow-y: visible !important;
  }

  page-break-inside: avoid;
`;

export const StyledPrintContainerHeader = styled.div`
  page-break-inside: avoid;

  @media print {
    min-width: 100% !important;
    overflow-y: visible !important;
  }
`;

export const StyledScrollPrint = styled.div`
  @media print {
    overflow-y: visible !important;
    height: auto !important;
    min-width: 100% !important;
    overflow-y: visible !important;
  }
`;
