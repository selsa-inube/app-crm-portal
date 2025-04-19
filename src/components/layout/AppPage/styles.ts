import { Link } from "react-router-dom";
import styled from "styled-components";

import { spacing } from "@design/tokens/spacing";

interface IStyledCollapseIcon {
  $collapse: boolean;
  $isTablet: boolean;
}

const StyledAppPage = styled.div`
  display: inherit;
  box-sizing: border-box;
`;

const StyledContainer = styled.div`
  display: inherit;
  overflow: hidden;

  nav {
    height: 97%;
  }
`;

const StyledMain = styled.main`
  box-sizing: border-box;
  height: calc(100vh - 54px);
  overflow-y: auto;
  padding-bottom: ${spacing.s600};
`;
const StyledContentImg = styled(Link)`
  width: 100px;
  text-decoration: none;
  color: inherit;
`;

const StyledLogo = styled.img`
  max-width: 100px;
  max-height: 32px;
  height: auto;
`;

const StyledCollapseIcon = styled.div<IStyledCollapseIcon>`
  display: flex;
  transition: all 500ms ease;
  position: absolute;
  top: ${({ $isTablet }) => ($isTablet ? "15px" : "13px")};
  transform: ${({ $collapse }) => ($collapse ? "rotate(-90deg)" : "rotate(90deg)")};
  left: ${({ $isTablet }) => ($isTablet ? "160px" : "130px")};
`;

const StyledCollapse = styled.div`
  position: absolute;
  top: 48px;
  z-index: 1;
`;

export {
  StyledAppPage,
  StyledContainer,
  StyledContentImg,
  StyledLogo,
  StyledMain,
  StyledCollapse,
  StyledCollapseIcon,
};
