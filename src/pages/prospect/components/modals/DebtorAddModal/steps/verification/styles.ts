import styled from "styled-components";

export const StyledScrollContainer = styled.div<{ $hasScroll: boolean }>`
  max-height: ${({ $hasScroll }) => ($hasScroll ? "500px" : "auto")};
  overflow-y: ${({ $hasScroll }) => ($hasScroll ? "auto" : "visible")};
  padding-right: ${({ $hasScroll }) => ($hasScroll ? "8px" : "0")};
`;
