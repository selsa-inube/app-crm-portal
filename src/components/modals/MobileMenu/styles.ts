import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const StyledMenu = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  position: fixed;
  top: 56px;
  right: 0;
  padding: "16px";
  border: 1px solid ${inube.palette.neutral.N40};
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 320px;
`;

export const StyledMenuItem = styled.div`
  padding: 12px 0;
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: none;
  }
`;
