import styled from "styled-components";

interface IStyledContainerAssisted {
  $cursorDisabled: boolean;
}

export const StyledContainerAssisted = styled.div<IStyledContainerAssisted>`
  & div > div:nth-child(3) button {
    cursor: ${({ $cursorDisabled }) =>
      $cursorDisabled ? "not-allowed" : "pointer"};
  }
`;
