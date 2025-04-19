import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

interface IStyledModal {
  $smallScreen: boolean;
  theme?: typeof inube;
}

interface IStyledContainerCards {
  $smallScreen: boolean;
  theme?: typeof inube;
}

const StyledModal = styled.div<IStyledModal>`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  background-color: ${({ theme }) => theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  height: ${({ $smallScreen }) => ($smallScreen ? "626px" : "618px")};
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

const StyledContainerCards = styled.div<IStyledContainerCards>`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ $smallScreen }) => ($smallScreen ? spacing.s200 : spacing.s200)};
  padding-right: ${spacing.s050};

  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme?.palette?.neutral?.N50 || inube.palette.neutral.N50};
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme?.palette?.neutral?.N70 || inube.palette.neutral.N70};
  }
`;

export { StyledModal, StyledContainerClose, StyledContainerCards };
