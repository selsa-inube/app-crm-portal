import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledContainer {
  marginsMobile: boolean;
}

export const StyledContainerClose = styled.div`
  cursor: pointer;
`;

export const StyledContainer = styled.div<IStyledContainer>`
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  border-radius: 8px;
  margin: ${({ marginsMobile }) => (marginsMobile ? "16px 0" : "0")};
`;
