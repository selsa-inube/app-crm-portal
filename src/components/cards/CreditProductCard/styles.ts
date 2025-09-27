import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledProduct {
  $new?: boolean;
  $disabled?: boolean;
}

export const StyledCreditProductCard = styled.div<IStyledProduct>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 217px;
  height: 414px;
  border-radius: 8px;
  outline: 2px solid
    ${({ theme, $disabled }) =>
      $disabled
        ? theme?.palette?.neutral?.N20 || inube.palette.neutral.N20
        : theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  background-color: ${({ theme, $disabled }) =>
    $disabled
      ? theme?.palette?.neutral?.N10 || inube.palette.neutral.N10
      : theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  box-shadow: ${({ $disabled }) =>
    $disabled
      ? "0px 2px 4px 1px rgba(9, 30, 66, 0.08)"
      : "0px 4px 8px 3px rgba(9, 30, 66, 0.13)"};
  cursor: ${({ $new, $disabled }) => {
    if ($disabled) return "not-allowed";
    return $new ? "pointer" : "normal";
  }};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  transition: all 0.2s ease-in-out;

  &:hover {
    ${({ $new, $disabled }) =>
      $new &&
      !$disabled &&
      `
        transform: translateY(-2px);
        box-shadow: 0px 6px 12px 4px rgba(9, 30, 66, 0.18);
      `}
  }

  @media print {
    height: 365px;
  }
`;

export const StyledDivider = styled.hr`
  margin: 0;
  width: 100%;
  border: none;
  border-top: 2px solid;
  border-top-color: ${({ theme }) =>
    theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
`;

export const StyledPrint = styled.div`
  @media print {
    display: none;
  }
`;
