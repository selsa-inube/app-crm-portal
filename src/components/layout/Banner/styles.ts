import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

const StyledRadioClient = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 46px;
  padding: ${spacing.s200} ${spacing.s075};
  box-sizing: border-box;
  min-width: 100%;
  box-shadow: 0px 1px 3px 1px
    ${({ theme }) => theme?.palette?.neutralAlpha?.N40A || inube.palette.neutralAlpha.N40A};
  border-radius: ${spacing.s050};
  border: 1px solid ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  background-color: ${({ theme }) => theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
`;

const StyledBannerImage = styled.img`
  width: 34px;
  height: 34px;
  object-fit: contain;
  border: 0.5px solid ${({ theme }) => theme?.palette?.blue?.B400 || inube.palette?.blue?.B400};
  border-radius: 2px;
  min-width: 34px;
  min-height: 34px;
`;

export { StyledRadioClient, StyledBannerImage };
