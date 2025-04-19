import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

const StyledAppPage = styled.div`
  display: flex;
  justify-content: center;
  padding: ${spacing.s1000};

  @media (max-width: 700px) {
    padding: ${spacing.s400};
  }
`;

const StyledQuickAccessContainer = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;

  @media (min-width: 769px) {
    padding: ${spacing.s250};
    gap: ${spacing.s250};
    border-radius: ${spacing.s100};
    border: 1px solid ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  }
`;

export { StyledAppPage, StyledQuickAccessContainer };
