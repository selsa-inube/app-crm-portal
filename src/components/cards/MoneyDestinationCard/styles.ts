import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const StyledMoneyDestinationCard = styled.label`
  width: 318px;
  min-width: 200px;
  & div:nth-child(1) {
    border-radius: 8px;
    box-sizing: border-box;
    cursor: pointer;
    background-color: ${({ theme }) =>
      theme?.palette?.neutral?.N10 || inube.palette.neutral.N10};
    box-shadow: 0px 1px 3px 1px
      ${({ theme }) =>
        theme?.palette?.neutralAlpha?.N40A || inube.palette.neutralAlpha.N40A};
    box-shadow: 0px 1px 2px 0px
      ${({ theme }) =>
        theme?.palette?.neutralAlpha?.N40A || inube.palette.neutralAlpha.N40A};
    ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
    border: 1px solid
      ${({ theme }) =>
        theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  }

  @media (max-width: 1000px) {
    width: 100%;
    max-height: 110px;
  }
`;

export const StyledRadio = styled.input`
  margin: 0px;
  height: 12px;
`;
