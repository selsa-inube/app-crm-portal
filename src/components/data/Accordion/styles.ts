import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

interface IStyledContainer {
  $isMobile: boolean;
  theme: typeof inube;
}

const StyledContainer = styled.div<IStyledContainer>`
  display: flex;
  padding: ${({ $isMobile }) =>
    $isMobile ? `${spacing.s200} ${spacing.s150}` : `${spacing.s200} ${spacing.s250}`};
  flex-direction: column;
  gap: ${spacing.s200};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  width: auto;
  box-sizing: border-box;
  align-items: flex-start;
`;

const StyledHead = styled.button`
  outline: none;
  border: none;
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  cursor: pointer;
`;

const StyledIcon = styled.div`
  cursor: pointer;
  width: 26px;
  height: 26px;
`;

export { StyledContainer, StyledHead, StyledIcon };
