import styled from "styled-components";

export const StyledDetails = styled.details`
  width: 100%;
  list-style: none;
  cursor: pointer;
`;

export const StyledSummary = styled.summary`
  display: flex;
  align-items: center;
`;

interface IStyledCollapseIcon {
  $collapse: boolean;
}

export const StyledCollapseIcon = styled.div<IStyledCollapseIcon>`
  display: flex;
  transition: all 500ms ease;
  transform: ${({ $collapse }) =>
    $collapse ? "rotate(-90deg)" : "rotate(90deg)"};
`;
