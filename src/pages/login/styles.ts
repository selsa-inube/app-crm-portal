import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledImage {
  width?: string;
}

export const StyledWelcomeContainer = styled.div`
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
`;

export const StyledOutletContainer = styled(StyledWelcomeContainer)`
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
`;

export const StyledImage = styled.img<IStyledImage>`
  width: ${({ width }) => width};
  max-width: 1200px;
`;
