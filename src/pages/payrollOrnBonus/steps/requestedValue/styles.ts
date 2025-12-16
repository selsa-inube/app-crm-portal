import { styled } from "styled-components";

export const StyledDividerWrapper = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  align-self: stretch;
  width: 1px;
  min-width: 1px;
  flex-shrink: 0;
`;

export const StyledRotatedDivider = styled.div`
  width: 1px;
  height: 100%;
  background-color: ${({ theme }) => theme?.palette?.neutral?.N40 || "#E0E0E0"};
  flex-shrink: 0;
`;
