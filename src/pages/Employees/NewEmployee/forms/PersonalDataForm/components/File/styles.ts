import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

interface IStyledFile {
  $withBorder?: boolean;
  theme: typeof inube;
}

const StyledFile = styled.div<IStyledFile>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${spacing.s100};
  padding: ${spacing.s150};
  ${({ $withBorder, theme }) =>
    $withBorder
      ? `
          border: 1px solid ${theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
          width: 243px;
        `
      : "border: none;"}
`;

export { StyledFile };
