import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const StyledScroll = styled.div`
  overflow-y: auto;
  padding-right: 8px;
  margin-bottom: 8px;

  ${({ theme }) =>
    `
    &::-webkit-scrollbar {
      width: 8px; 
      border-radius: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${
        theme?.palette?.neutral?.N30 || inube.palette.neutral.N30
      };
      border-radius: 8px;
    }
  `}
`;
