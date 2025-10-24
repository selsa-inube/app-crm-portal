import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledModal {
  $smallScreen: boolean;
}

export const StyledModal = styled.div<IStyledModal>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  max-height: "382px";
  height: ${({ $smallScreen }) => ($smallScreen ? "340px" : "448px")};
  width: ${({ $smallScreen }) => ($smallScreen ? "350px" : "500px")};
  padding: ${({ $smallScreen }) => ($smallScreen ? "16px" : "24px")};
  gap: ${({ $smallScreen }) => ($smallScreen ? "16px" : "24px")};
  border-radius: "8px";
`;

export const StyledContainerClose = styled.div`
  cursor: pointer;
`;
export const StyledContainerTextField = styled.div<IStyledModal>`
  height: 65px;
  width: auto;
  border-radius: 8px;
  padding: 6px 16px 6px 16px;
  gap: 16px;
  margin: 0 0 24px 0;
  overflow-y: auto;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N10 || inube.palette.neutral.N10};

  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) =>
      theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
    border-radius: 8px;
  }
`;
