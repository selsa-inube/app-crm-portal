import { inube } from "@inubekit/inubekit";
import styled from "styled-components";

interface IStyledContainer {
  $isMobile?: boolean;
}
export const StyledScrollContainer = styled.div<{ $hasScroll: boolean }>`
  max-height: ${({ $hasScroll }) => ($hasScroll ? "500px" : "auto")};
  overflow-y: ${({ $hasScroll }) => ($hasScroll ? "auto" : "visible")};
  padding-right: ${({ $hasScroll }) => ($hasScroll ? "8px" : "0")};
`;
export const StyledBoxAttribute = styled.div<IStyledContainer>`
  display: flex;
  padding: 12px 16px;
  gap: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  align-items: center;
  width: ${({ $isMobile }) => ($isMobile ? "auto" : "552px")};
  border: 1px solid ${inube.palette.neutral.N700};
`;

export const StyledDivider = styled.div`
  grid-column: 1 / -1;
  height: 1px;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N40 || inube.palette.neutralAlpha.N40A};
  margin: 15px 0;
`;
