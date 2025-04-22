import styled from "styled-components";
import { Link } from "react-router-dom";
import { inube } from "@inubekit/inubekit";

import { MenuItemSpacingType } from "./types";

interface IStyledMenuItemLink {
  $spacing: MenuItemSpacingType;
  $disabled: boolean;
}

export const StyledMenuItemLink = styled(Link)<IStyledMenuItemLink>`
  display: flex;
  justify-content: space-between;
  text-decoration: none;
  align-items: center;
  height: ${(props) => (props.$spacing === "wide" ? "40px" : "36px")};
  padding: ${(props) =>
    props.$spacing === "wide" ? `${"8px"} ${"16px"}` : `${"4px"} ${"16px"}`};
  background-color: ${(props) =>
    props.$disabled
      ? props.theme.color?.surface?.gray?.disabled || inube.palette.neutral.N20
      : props.theme.color?.surface?.light?.clear || inube.palette.neutral.N0};

  &:hover {
    cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
    background-color: ${({ theme }) =>
      theme.color?.surface?.gray?.hover || inube.palette.neutral.N20};
  }
`;
