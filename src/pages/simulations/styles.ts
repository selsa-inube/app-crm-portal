import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

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
    @page {
      margin: 1in 0.6in 1in 0.75in;
    }
    margin: -28px 0 0 0;
  }
`;

export const StyledScrollPrint = styled.div`
  @media print {
    ::-webkit-scrollbar {
      display: none;
    }

    overflow: hidden !important;
  }
`;

export const StyledRecalculate = styled.div`
  cursor: pointer;
  min-width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) => theme?.palette?.neutral?.N0 || inube.palette.blue.B400};
  display: flex;
  justify-content: center;
  align-items: center;
`;
