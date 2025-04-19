import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

interface IStyledContainer {
  theme: typeof inube;
}

const StyledContractCard = styled.div<IStyledContainer>`
  height: 344px;
  border-radius: 8px;
  padding: ${spacing.s150};
  box-shadow: 0px 2px 6px 1px
    ${({ theme }) => theme?.palette?.neutral?.N50 || inube.palette.neutral.N50};
  user-select: none;
`;

const StyledSeparatorLine = styled.hr`
  width: 2px;
  margin: 0px;
  border: 0px;
  background-color: ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
`;

export { StyledContractCard, StyledSeparatorLine };
