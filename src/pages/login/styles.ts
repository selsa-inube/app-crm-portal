import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledImage {
  $maxWidth?: string;
  $maxHeight?: string;
}

export const StyledWelcomeContainer = styled.div`
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  box-sizing: border-box;
  border-bottom: 1px solid
    ${({ theme }) => theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
  box-shadow:
    0px 1px 3px 1px
      ${({ theme }) =>
        theme?.palette?.neutral?.N40 || inube.palette.neutral.N40},
    0px 1px 2px 0px
      ${({ theme }) =>
        theme?.palette?.neutral?.N20 || inube.palette.neutral.N20};
`;
export const StyledOutletContainer = styled(StyledWelcomeContainer)`
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
`;

export const StyledImage = styled.img<IStyledImage>`
  max-width: ${({ $maxWidth }) => $maxWidth || "180px"};
  max-height: ${({ $maxHeight }) => $maxHeight || "80px"};
  width: auto;
  height: auto;
  object-fit: contain;
`;
