import { inube } from "@inubekit/inubekit";
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

export const StyledArrowBack = styled.div`
  cursor: pointer;
  width: 500px;
`;
export const StyledSeparatorLine = styled.hr`
  width: 2px;
  margin: 0px;
  border: 0px;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
`;
