import { styled } from "styled-components";
import { Link } from "react-router-dom";
import { inube } from "@inubekit/inubekit";

interface IStyledArrowBack {
  $isMobile: boolean;
}

export const StyledHeaderContainer = styled.div`
  position: relative;
`;
export const StyledContentImg = styled(Link)`
  width: 100px;
`;

export const StyledLogo = styled.img`
  max-width: 120px;
`;

export const StyledCard = styled.label`
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
export const StyledArrowBack = styled.div<IStyledArrowBack>`
  cursor: pointer;
  width: ${($isMobile) => ($isMobile ? "100px" : "500px")};
`;

export const StyledCreditCard = styled.div`
  width: 194px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
