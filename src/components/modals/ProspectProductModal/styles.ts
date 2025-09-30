import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledModal {
  $smallScreen: boolean;
}

export const ScrollableContainer = styled.div<IStyledModal>`
  width: ${({ $smallScreen }) => ($smallScreen ? "270px" : "auto")};
  padding: 10px;
  overflow: auto;
  display: flex;
  max-height: width: ${({ $smallScreen }) => ($smallScreen ? "auto" : "500px")};

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
