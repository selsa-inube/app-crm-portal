import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

interface IStyledContainer {
  theme: typeof inube;
}

const StyledContainer = styled.div<IStyledContainer>`
  display: flex;
  align-items: center;
  padding: 0px ${spacing.s050} 0px ${spacing.s025};
  gap: ${spacing.s100};
  border-radius: ${spacing.s050};
  background-color: ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  cursor: pointer;
`;

const StyledIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${spacing.s025};
`;

export { StyledContainer, StyledIcon };
