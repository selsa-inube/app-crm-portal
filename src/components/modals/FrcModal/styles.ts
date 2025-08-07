import styled from "styled-components";

interface IStyledExpandedProps {
  $expanded: boolean;
}

export const StyledExpanded = styled.div<IStyledExpandedProps>`
  transform: ${({ $expanded }) =>
    $expanded ? "rotate(180deg)" : "rotate(0deg)"};
  transform-origin: center;
  transition: all 500ms ease;
  margin-left: 6px;
`;
