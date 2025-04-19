import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

interface IStyledModal {
  $smallScreen: boolean;
  theme: typeof inube;
}

export const StyledModal = styled.div<IStyledModal>`
  overflow: auto;
  display: flex;
  flex-direction: column;
  max-height: "auto";
  width: ${({ $smallScreen }) => ($smallScreen ? "302px" : "402px")};
  background-color: ${inube.palette.neutral.N0};
  padding: ${({ $smallScreen }) => ($smallScreen ? spacing.s200 : spacing.s300)};
  gap: ${({ $smallScreen }) => ($smallScreen ? spacing.s200 : spacing.s300)};
  border-radius: ${spacing.s100};
`;

export const StyledContainerContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const StyledContainerClose = styled.div`
  cursor: pointer;
`;

export const StyledContainerTitle = styled.div`
  display: flex;
  margin: 0;
  padding: 0;
  justify-content: space-between;
`;

export const StyledBoxAttribute = styled.div<IStyledModal>`
  align-items: center;
  border-radius: 8px;
  padding: ${({ $smallScreen }) =>
    $smallScreen ? spacing.s100 : `${spacing.s075} ${spacing.s150}`};
  background-color: ${({ theme }) => theme?.palette?.neutral?.N10 || inube.palette.neutral.N10};
  width: auto;
`;
