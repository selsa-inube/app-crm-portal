import { inube } from "@inubekit/inubekit";
import styled from "styled-components";

interface IStyledContainerGeneralHeader {
  isSmallScreen: boolean;
}

export const StyledContainerGeneralHeader = styled.div<IStyledContainerGeneralHeader>`
  display: flex;
  border-radius: 4px;
  box-shadow: 0px 1px 2px 0px #0000004d;
  position: sticky;
  top: 0;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  z-index: 1;
  height: inherit;
  width: min(
    100% - ${({ isSmallScreen }) => (isSmallScreen ? "40px" : "80px")},
    1064px
  );
  margin: 24px 0 0 0;
`;

export const StyledPerfil = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 2px;
  border: 0.5px solid var(--Primary-color-text-primary-regular, #0052cc);
`;
