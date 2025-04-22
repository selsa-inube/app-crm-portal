import styled from "styled-components";
import { inube } from "@inubekit/inubekit";
interface IStyledModal {
  $smallScreen: boolean;
}

export const StyledModal = styled.div<IStyledModal>`
  display: flex;
  flex-direction: column;
  height: ${({ $smallScreen }) => ($smallScreen ? "176px" : "850px")};
  width: ${({ $smallScreen }) => ($smallScreen ? "335px" : "1312px")};
  background-color: ${({ theme }) =>
    theme.color?.surface?.light?.clear || inube.palette.neutral.N0};
  padding: ${({ $smallScreen }) => ($smallScreen ? "16px" : "24px")};
  gap: ${({ $smallScreen }) => ($smallScreen ? "16px" : "24px")};
  border-radius: 8px;
`;

export const StyledContainerClose = styled.div`
  cursor: pointer;
`;
