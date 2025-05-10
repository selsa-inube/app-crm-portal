import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const StyledContainer = styled.div`
  box-shadow: 8px 2px 8px
    ${({ theme }) => theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
  background-color: white;
  border-radius: 4px;
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 99;

  figure {
    margin-right: 5px;
  }

  div > figure {
    position: absolute;
    right: 2%;
  }
`;

export const StyledUl = styled.ul`
  margin: 0px 30px 0px 0px;
  padding: 0px;
`;

export const StyledLi = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  padding: 6px 0px;
`;
