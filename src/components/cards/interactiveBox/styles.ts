import styled from "styled-components";
import { Link } from "react-router-dom";
import { inube } from "@inubekit/inubekit";

interface IStyledInteractiveBox {
  $isMobile: boolean;
  $isDisabled?: boolean;
}

const StyledInteractiveBox = styled(Link)<IStyledInteractiveBox>`
  box-sizing: border-box;
  padding: 12px 24px;

  width: ${($isMobile) => ($isMobile ? "100%" : "305px")};
  min-height: ${($isMobile) => ($isMobile ? "auto" : "100px")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : 0)};
  border-radius: 8px;
  text-decoration: none;
  color: ${({ theme }) =>
    theme?.palette?.neutral.N900 || inube.palette.neutral.N900};
  border: 1px solid
    ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  box-shadow: 3px 3px 5px 1px
    ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  cursor: ${({ $isDisabled }) => ($isDisabled ? "default" : "pointer")};
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.5 : 1)};
  pointer-events: ${({ $isDisabled }) => ($isDisabled ? "none" : "auto")};

  &:hover {
    color: ${({ theme, $isDisabled }) =>
      $isDisabled
        ? theme?.palette?.neutral.N900 || inube.palette.neutral.N900
        : theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
    background-color: ${({ theme, $isDisabled }) =>
      $isDisabled
        ? "transparent"
        : theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
    box-shadow: ${({ $isDisabled }) =>
      $isDisabled ? "3px 3px 5px 1px" : "none"};
  }

  div {
    gap: ${({ $isMobile }) => ($isMobile ? "4px" : "12px")};
  }
`;

export { StyledInteractiveBox };
