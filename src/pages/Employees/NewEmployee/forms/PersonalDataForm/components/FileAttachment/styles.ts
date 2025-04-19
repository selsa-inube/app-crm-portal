import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

import { spacing } from "@design/tokens/spacing";

interface IStyledFileAttachment {
  theme?: typeof inube;
  $attachedFile?: File;
}

const StyledFileAttachment = styled.div<IStyledFileAttachment>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: ${spacing.s100};
  ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  gap: ${spacing.s150};
  border: 1px solid ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
  padding: ${spacing.s150} ${spacing.s200};

  ${({ $attachedFile }) => $attachedFile && "height: 125px;"}
`;

export { StyledFileAttachment };
