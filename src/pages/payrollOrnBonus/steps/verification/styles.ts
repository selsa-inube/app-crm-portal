import { inube } from "@inubekit/inubekit";
import styled from "styled-components";

export const StyledScrollContainer = styled.div<{ $hasScroll: boolean }>`
  max-height: ${({ $hasScroll }) => ($hasScroll ? "500px" : "auto")};
  overflow-y: ${({ $hasScroll }) => ($hasScroll ? "auto" : "visible")};
  padding-right: ${({ $hasScroll }) => ($hasScroll ? "8px" : "0")};
`;
export const StyledBoxAttribute = styled.div`
  display: flex;
  padding: 12px 16px;
  gap: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  align-items: center;
  width: 552px;
  border: 1px solid ${inube.palette.neutral.N700};
`;
