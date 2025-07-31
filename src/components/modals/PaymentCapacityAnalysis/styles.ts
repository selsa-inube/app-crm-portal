import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledModal {
  $smallScreen: boolean;
}

export const ScrollableContainer = styled.div<IStyledModal>`
  height: ${({ $smallScreen }) => ($smallScreen ? "530px" : "670px")};
  padding: 10px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) =>
      theme?.palette?.neutral?.N50 || inube.palette.neutral.N50};
    border-radius: 8px;
  }
`;
