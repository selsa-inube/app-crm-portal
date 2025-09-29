import { Link } from "react-router-dom";
import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledCollapseIcon {
  $collapse: boolean;
  $isTablet: boolean;
}

interface IStyledFooter {
  $nav: boolean;
  isShowMenuOnHeader: boolean;
  showNav: boolean;
}

export const StyledAppPage = styled.div`
  display: inherit;
  box-sizing: border-box;
`;

export const StyledContainer = styled.div`
  display: inherit;
  overflow: hidden;

  @media print {
    overflow: visible !important;
  }
`;

export const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow-y: auto;
`;

export const StyledContentImg = styled(Link)`
  width: 100px;
  display: flex;
  justify-content: center;
`;

export const StyledLogo = styled.img`
  with: 100%;
  height: 100%;
  object-fit: contain;
`;

export const StyledHeaderContainer = styled.div`
  z-index: 2;
  position: relative;
`;

export const StyledContainerNav = styled.div`
  max-height: calc(100vh - 50px);
`;

export const StyledCollapseIcon = styled.div<IStyledCollapseIcon>`
  display: flex;
  transition: all 500ms ease;
  position: absolute;
  top: ${({ $isTablet }) => ($isTablet ? "8.5px" : "13px")};
  transform: ${({ $collapse }) =>
    $collapse ? "rotate(-90deg)" : "rotate(90deg)"};
  left: ${({ $isTablet }) => ($isTablet ? "200px" : "160px")};
  z-index: 2;
`;

export const StyledMenuContainer = styled.div`
  position: absolute;
  height: 100%;
  top: 48px;
  right: 15px;
  z-index: 1;
  overflow: hidden;
  border-radius: 8px;
  width: 312px;
  box-shadow: 0px 2px 3px 0px #091e4221;
  box-shadow: 0px 6px 10px 4px #091e4221;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};

  hr {
    color: ${({ theme }) =>
      theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
  }
`;

export const StyledCollapse = styled.div`
  position: absolute;
  top: 48px;
  z-index: 2;
`;

export const StyledFooter = styled.footer<IStyledFooter>`
  display: inline-flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N10 || inube.palette.neutral.N10};
  width: ${({ $nav }) => ($nav ? "auto" : "200px")};
  height: 50px;
  top: -50px;
  position: relative;
`;

export const StyledPrint = styled.div`
  @media print {
    display: none;
  }

  height: 100%;
`;
