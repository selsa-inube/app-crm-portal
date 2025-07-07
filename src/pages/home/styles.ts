import { Link } from "react-router-dom";
import styled from "styled-components";

interface IStyledContainer {
  $smallScreen?: boolean;
  $typeTabs?: boolean;
}
interface IStyledCollapseIcon {
  $collapse: boolean;
  $isTablet: boolean;
}
const StyledTitle = styled.div<IStyledContainer>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-S300, 24px);
  align-self: stretch;
`;

const StyledHeaderContainer = styled.div`
  z-index: 2;
  position: fixed;
  width: 100%;
`;

const StyledGeneralHeader = styled.div`
  position: sticky;
  top: 74px;
  z-index: 1;
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StyledCollapse = styled.div`
  z-index: 2;
  position: absolute;
  top: 48px;
`;
const StyledContentImg = styled(Link)`
  width: 100px;
`;

const StyledLogo = styled.img`
  max-width: 120px;
`;

const StyledCollapseIcon = styled.div<IStyledCollapseIcon>`
  display: flex;
  transition: all 500ms ease;
  position: absolute;
  top: ${({ $isTablet }) => ($isTablet ? "8.5px" : "13px")};
  transform: ${({ $collapse }) =>
    $collapse ? "rotate(-90deg)" : "rotate(90deg)"};
  left: ${({ $isTablet }) => ($isTablet ? "200px" : "160px")};
  z-index: 3;
`;
const StyledContainerCards = styled.div<IStyledContainer>`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: ${(props) => (props.$smallScreen ? "center" : "flex-start")};
  border: ${(props) => (props.$smallScreen ? "none" : "1px solid #E0E0E0")};
  border-radius: 8px;
  padding: 16px;

  & > * {
    flex: 1 1 calc(25% - 24px);
    min-width: 250px;
    max-width: calc(25% - 24px);
  }
`;

export {
  StyledHeaderContainer,
  StyledTitle,
  StyledCollapseIcon,
  StyledLogo,
  StyledContentImg,
  StyledCollapse,
  StyledContainerCards,
  StyledGeneralHeader,
};
