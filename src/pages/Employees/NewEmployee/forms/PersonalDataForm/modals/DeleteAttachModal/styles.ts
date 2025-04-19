import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

interface IStyledModal {
  $smallScreen: boolean;
  theme?: typeof inube;
}

const StyledModal = styled.div<IStyledModal>`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  background-color: ${({ theme }) => theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  height: ${({ $smallScreen }) => ($smallScreen ? "140px" : "150px")};
  width: ${({ $smallScreen }) => ($smallScreen ? "311px" : "402px")};
  padding: ${({ $smallScreen }) =>
    $smallScreen ? spacing.s150 : `${spacing.s200} ${spacing.s300}`};
  gap: ${spacing.s200};
  border-radius: ${spacing.s100};

  textarea {
    resize: none;
  }
`;

const StyledContainerClose = styled.div`
  cursor: pointer;
`;

export { StyledModal, StyledContainerClose };
