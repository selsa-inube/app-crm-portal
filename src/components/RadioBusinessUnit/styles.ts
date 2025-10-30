import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const StyledRadioBusinessUnit = styled.label`
  & div {
    box-sizing: border-box;
    min-height: 58px;
    box-shadow: 1px 2px 2px 1px
      ${({ theme }) =>
        theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
    border: 1px solid
      ${({ theme }) =>
        theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
    cursor: pointer;
  }
`;

export const StyledRadio = styled.input`
  width: 16px;
  height: 16px;

  &:checked ~ img {
    filter: grayscale(0%);
  }
`;

interface StyledImageProps {
  $isMobile: boolean;
  hasLogo: boolean;
}

export const StyledImage = styled.img<StyledImageProps>`
  font-family: Roboto;
  font-size: 14px;
  max-width: ${({ hasLogo }) => (hasLogo ? "35%" : "100%")};
  transition: filter 500ms ease-out;
  filter: grayscale(100%);
  display: ${({ $isMobile }) => ($isMobile ? "none" : "block")};
`;
