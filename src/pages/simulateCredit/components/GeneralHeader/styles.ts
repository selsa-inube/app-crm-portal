import { inube } from "@inubekit/inubekit";
import styled from "styled-components";

export const StyledContainerGeneralHeader = styled.div`
  display: flex;
  border-radius: 4px;
  box-shadow: 0px 1px 2px 0px #0000004d;
  position: sticky;
  top: 0;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  z-index: 1;
  height: inherit;
`;

export const StyledPerfil = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 2px;
  border: 0.5px solid var(--Primary-color-text-primary-regular, #0052cc);
`;
