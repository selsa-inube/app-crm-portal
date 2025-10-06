import { styled } from "styled-components";
import { Link } from "react-router-dom";

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
