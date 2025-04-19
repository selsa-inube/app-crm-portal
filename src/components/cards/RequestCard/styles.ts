import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

interface IStyledRequestCard {
  theme: typeof inube;
}

const StyledRequestCard = styled.div<IStyledRequestCard>`
  width: 280px;
  height: 207px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${spacing.s100};
  padding: ${spacing.s150};
  border-radius: 8px;
  box-shadow: 0px 2px 6px 1px
    ${({ theme }) => theme?.palette?.neutral?.N50 || inube.palette.neutral.N50};
  box-sizing: border-box;
  user-select: none;
`;

const StyledTitle = styled.div`
  background-color: ${({ theme }) => theme?.palette?.blue?.B50 || inube.palette.blue.B50};
  text-align: center;
  font-weight: bold;
  border-radius: 4px;
  gap: ${spacing.s100};
  height: 20px;
  justify-content: center;
  padding-left: ${spacing.s075};
  padding-right: ${spacing.s075};
`;

export { StyledRequestCard, StyledTitle };
