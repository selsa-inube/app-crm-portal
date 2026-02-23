import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const ScrollableContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  & > * {
    flex-shrink: 0;
  }

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: ${({ theme }) =>
      theme?.palette?.neutral?.N100 || "rgba(235, 236, 240, 1)"};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) =>
      theme?.palette?.neutral?.N50 || inube.palette.neutral.N50};
    border-radius: 8px;
  }
`;
export const StyledCardsContainer = styled.div<{ isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${({ isMobile }) =>
    isMobile ? "1fr" : "repeat(2, 1fr)"};
  gap: 16px;
  width: 100%;
  height: ${({ isMobile }) => (isMobile ? "300px" : "84px")};
  padding: 0 20px;
  overflow-x: hidden;
`;
