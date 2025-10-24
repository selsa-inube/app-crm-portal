import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledModal {
  $smallScreen: boolean;
}

export const StyledModal = styled.div<IStyledModal>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) =>
    theme.palette?.neutral?.N0 || inube.palette.neutral.N0};
  width: ${({ $smallScreen }) => ($smallScreen ? "280px" : "500px")};
  padding: ${({ $smallScreen }) => ($smallScreen ? "16px" : "24px")};
  gap: ${({ $smallScreen }) => ($smallScreen ? "16px" : "24px")};
  border-radius: ${"8px"};
`;

export const StyledContainerClose = styled.div`
  cursor: pointer;
`;
