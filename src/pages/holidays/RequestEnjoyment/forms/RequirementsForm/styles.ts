import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

interface StyledContainerProps {
  $isMobile: boolean;
  theme?: typeof inube;
}

const StyledContainer = styled.div<StyledContainerProps>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) => ($isMobile ? "1fr" : "repeat(2, 1fr)")};
  gap: ${spacing?.s350};
  border-radius: ${spacing?.s100 || "8px"};
  border: 1px solid ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  padding: ${({ $isMobile }) =>
    $isMobile ? `${spacing?.s300 || "24px"} ${spacing?.s150 || "12px"}` : spacing?.s300 || "24px"};

  > * {
    width: 100%;
  }

  textarea {
    resize: none;
  }
`;

export { StyledContainer };
