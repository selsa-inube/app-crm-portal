import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface IStyledModal {
  $smallScreen: boolean;
}

export const StyledContainer = styled.div<IStyledModal>`
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  max-height: ${({ $smallScreen }) => ($smallScreen ? "auto" : "936px")};
  width: ${({ $smallScreen }) => ($smallScreen ? "auto" : "100%")};
  border-radius: 8px;
`;
