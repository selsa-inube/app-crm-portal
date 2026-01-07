import { inube } from "@inubekit/inubekit";
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
  width: 2px;
  height: 100%;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N40 || inube.palette.neutralAlpha.N40A};
  flex-shrink: 0;
`;
