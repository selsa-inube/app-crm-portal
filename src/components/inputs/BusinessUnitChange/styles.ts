import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

const StyledContainer = styled.div`
  box-shadow: 2px 2px 3px 2px
    ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  border-radius: ${spacing.s100};
  background-color: ${({ theme }) => theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  margin-left: ${spacing.s050};
  margin-top: ${spacing.s100};
  z-index: 3;
`;

const StyledUl = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: ${spacing.s0};
  padding: ${spacing.s0} ${spacing.s050};
`;

const StyledLi = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const StyledContainerOption = styled.div`
  cursor: pointer;
`;

const StyledImg = styled.img`
  position: relative;
  max-height: 32px;
  height: 30px;
  left: ${spacing.s050};
  padding: ${spacing.s150} ${spacing.s150} ${spacing.s150} ${spacing.s100};
  object-fit: contain;
`;

export { StyledContainer, StyledUl, StyledLi, StyledImg, StyledContainerOption };
