import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IScrollableContainer {
  $length: boolean;
}

export const StyledContainerClose = styled.div`
  cursor: pointer;
`;

export const StyledContainer = styled.div`
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  border-radius: 8px;
`;

export const ScrollableContainer = styled.div<IScrollableContainer>`
  height: ${({ $length }) => ($length ? "auto" : "132px")};
  overflow: auto;
  border: ${({ $length }) => ($length ? "0px" : "1px solid")};
  border-color: ${({ theme }) =>
    theme?.palette?.neutral?.N50 || inube.palette.neutral.N50};
  border-radius: 8px;
  padding: ${({ $length }) => ($length ? "0px" : "8px 8px 0 8px")};
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar {
    width: 8px;
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
