import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { SectionBackground, SectionOrientation } from "./types";
interface IStyledBoardSection {
  theme?: typeof inube;
  $sectionBackground?: SectionBackground;
  $orientation?: SectionOrientation;
  $isTablet: boolean;
}
interface IStyledCollapseIcon {
  $collapse: boolean;
  $disabledCollapse: boolean;
}

export const StyledBoardSection = styled.div<IStyledBoardSection>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 12px 12px;
  width: calc(100% - 24px);
  border-top: 1px solid;
  border-bottom: ${({ $orientation }) =>
    $orientation !== "horizontal" ? "1px solid" : "none"};
  border-color: ${({ theme }) =>
    theme?.color?.stroke?.divider?.dark || inube.palette.neutral.N40};
  background-color: ${({ theme, $sectionBackground }) =>
    $sectionBackground === "gray"
      ? theme?.color?.surface?.gray?.regular || inube.palette.neutral.N30
      : theme?.color?.surface?.light?.regular || inube.palette.neutral.N10};

  & > div:nth-child(1) {
    justify-content: space-between;
    margin-right: ${({ $isTablet }) => ($isTablet ? "20px" : "0px")};
  }
`;

export const StyledCollapseIcon = styled.div<IStyledCollapseIcon>`
  display: flex;
  transition: all 500ms ease;
  transform: ${({ $collapse }) =>
    $collapse ? "rotate(90deg)" : "rotate(0deg)"};
  cursor: ${({ $disabledCollapse }) =>
    $disabledCollapse ? "not-allowed" : "pointer"};
`;
