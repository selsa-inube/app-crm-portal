import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const ScrollableContainer = styled.div`
  height: 100%;
  overflow: auto;

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
