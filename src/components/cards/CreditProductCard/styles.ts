import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledProduct {
  $new?: boolean;
  $showIcons?: boolean;
}

export const StyledCreditProductCard = styled.div<IStyledProduct>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 217px;
  height: ${({ $showIcons }) => ($showIcons ? "414px" : "350px")};
  border-radius: 8px;
  outline: 2px solid
    ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  box-shadow: 0px 4px 8px 3px rgba(9, 30, 66, 0.13);
  cursor: ${({ $new }) => ($new ? "pointer" : "normal")};
  page-break-inside: avoid;

  @media print {
    height: 335px;
  }
`;
export const StyledDivider = styled.hr`
  margin: 0;
  width: 100%;
  border: none;
  border-top: 2px solid;
  border-top-color: ${({ theme }) =>
    theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
`;
export const StyledPrint = styled.div`
  @media print {
    display: none;
  }
`;
