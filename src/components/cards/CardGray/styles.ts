import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledContainer {
  $isMobile: boolean;
}

export const StyledContainer = styled.div<IStyledContainer>`
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N10 || inube.palette.neutral.N10};
  border-radius: 8px;
  padding: 6px 16px;
  text-overflow: ellipsis;
  width: ${({ $isMobile }) => ($isMobile ? "90%" : "auto")};
`;
