import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const StyledRadioClient = styled.label`
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
  width: 50px;
  height: 16px;

  &:checked ~ img {
    filter: grayscale(0%);
  }
`;

export const StyledImage = styled.img`
  font-family: "Roboto";
  font-size: 14px;
  width: 80%;
  transition: filter 500ms ease-out;
  filter: grayscale(100%);

  @media screen and (max-width: 460px) {
    display: none;
  }
`;
