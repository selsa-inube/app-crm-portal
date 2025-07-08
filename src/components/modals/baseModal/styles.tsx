import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const StyledContainerClose = styled.div`
  cursor: pointer;
`;

export const StyledContainer = styled.div`
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  border-radius: 8px;
`;
export const StyledContainerBlanket = styled.div`
  && div:nth-child(3) {
    z-index: 1;
  }
  && div:nth-child(1) {
    z-index: 0;
  }
`;
