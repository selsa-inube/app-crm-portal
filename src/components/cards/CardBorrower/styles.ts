import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledContainer {
  disabled?: boolean;
  $showIcons?: boolean;
  $new?: boolean;
  $isMobile?: boolean;
}

export const StyledContainer = styled.div<IStyledContainer>`
  width: ${({ $isMobile }) => ($isMobile ? "285px" : "315px")};
  height: 368px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  outline: 2px solid
    ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  box-shadow: 0px 4px 8px 3px rgba(9, 30, 66, 0.13);
  border: 1px solid
    ${({ disabled, theme }) =>
      disabled
        ? theme?.palette?.blue?.B400 || inube.palette.blue.B400
        : theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  justify-content: center;
  cursor: ${({ $new }) => ($new ? "pointer" : "normal")};
`;
