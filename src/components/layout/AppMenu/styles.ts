import styled from "styled-components";

import { spacing } from "@design/tokens/spacing";

const StyledAppMenu = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: ${spacing.s400} ${spacing.s800};

  @media (max-width: 490px) {
    padding: ${spacing.s200};
  }
`;

export { StyledAppMenu };
