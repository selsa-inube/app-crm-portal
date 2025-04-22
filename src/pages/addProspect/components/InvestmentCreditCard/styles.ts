import { inube } from "@inubekit/inubekit";
import styled from "styled-components";

interface IStyledContainer {
  $isMobile?: boolean;
}

export const StyledContainer = styled.div<IStyledContainer>`
  width: ${({ $isMobile }) => ($isMobile ? "276px" : "296px")};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  outline: 1px solid
    ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  box-shadow: 0px 4px 8px 3px rgba(9, 30, 66, 0.13);
  border: 1px solid
    var(--Primary-color-text-primary-regular, rgba(0, 82, 204, 1));
`;

export const StyledInput = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N10 || inube.palette.neutral.N10};
`;
