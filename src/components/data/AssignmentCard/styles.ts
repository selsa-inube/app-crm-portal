import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

interface IStyledContainer {
  theme: typeof inube;
  $isMobile: boolean;
}

const StyledAssignmentCard = styled.div<IStyledContainer>`
  height: 138px;
  border-radius: 8px;
  padding: ${spacing.s150};
  width: ${({ $isMobile }) => ($isMobile ? "100%" : "220px")};
  box-shadow: 0px 2px 6px
    ${({ theme }) => theme?.palette?.neutral?.N50 || inube.palette.neutral.N50};
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
`;

export { StyledAssignmentCard };
