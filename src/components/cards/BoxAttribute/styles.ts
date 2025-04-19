import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

interface IStyledBoxAttribute {
  $smallScreen?: boolean;
  theme?: typeof inube;
}

const StyledBoxAttribute = styled.div<IStyledBoxAttribute>`
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: ${({ $smallScreen }) =>
    $smallScreen ? spacing.s100 : `${spacing.s075} ${spacing.s150}`};
  background-color: ${({ theme }) => theme?.palette?.neutral?.N10 || inube.palette.neutral.N10};
  width: auto;
`;

export { StyledBoxAttribute };
