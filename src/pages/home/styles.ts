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
  position: relative;
`;

const StyledCollapse = styled.div`
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
`;
export {
  StyledHeaderContainer,
  StyledTitle,
  StyledCollapseIcon,
  StyledLogo,
  StyledContentImg,
  StyledCollapse,
};
