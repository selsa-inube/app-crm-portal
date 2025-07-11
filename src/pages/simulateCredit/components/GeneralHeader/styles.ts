import { inube } from "@inubekit/inubekit";
import styled from "styled-components";

export const StyledContainerGeneralHeader = styled.div`
  border-radius: 4px;
  box-shadow: 0px 1px 2px 0px #0000004d;
  position: sticky;
  top: 0;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
`;

export const StyledPerfil = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 2px;
  border: 0.5px solid var(--Primary-color-text-primary-regular, #0052cc);
`;
