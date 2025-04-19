import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface Theme {
  palette: {
    neutral: {
      N0: string;
      N40: string;
    };
  };
}

const StyledContainer = styled.div`
  position: absolute;

  figure {
    margin-right: 5px;
  }

  div > figure {
    position: absolute;
    right: 2%;
  }
`;

const StyledUl = styled.ul`
  margin: 0px 30px 0px 0px;
  padding: 0px;
`;

const StyledLi = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  padding: 6px 0px;
  cursor: pointer;
`;

const StyledActions = styled.div<{ theme?: Theme }>`
  border-radius: 4px;
  position: absolute;
  right: -8px;
  top: -2px;
  background-color: ${({ theme }) => theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  box-shadow: 8px 2px 6px
    ${({ theme }) => theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
`;

export { StyledContainer, StyledUl, StyledLi, StyledActions };
