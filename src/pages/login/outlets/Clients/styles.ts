import styled from "styled-components";

import { spacing } from "@design/tokens/spacing";
import { inube } from "@inubekit/inubekit";

interface StyledClientsListProps {
  $isMobile: boolean;
  $scroll?: boolean;
}

const StyledClients = styled.div`
  & form {
    & > div {
      gap: ${spacing.s500};
      margin: 40px auto 0px;
      width: 500px;
      @media screen and (max-width: 532px) {
        width: auto;
        margin: 30px 0px;
      }
    }
  }
`;

const StyledClientsList = styled.div<StyledClientsListProps>`
  & > div {
    list-style: none;
    min-height: 300px;
    max-height: ${({ $isMobile }) => ($isMobile ? "none" : "430px")};
    padding: ${spacing.s100};
    width: inherit;
    overflow-y: ${({ $scroll }) => ($scroll ? "scroll" : "visible")};
    @media screen and (max-height: 1000px) {
      min-height: 200px;
    }
  }

  ::-webkit-scrollbar {
    width: 8px;
    border-radius: 8px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
    border-radius: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme?.palette?.neutral?.N50 || inube.palette.neutral.N50};
    border-radius: 8px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme?.palette?.neutral?.N70 || inube.palette.neutral.N70};
  }
`;

const StyledNoResults = styled.div`
  margin: ${spacing.s200} ${spacing.s0};
`;

const StyledClientsItem = styled.li`
  width: 100%;
`;

export { StyledClients, StyledClientsList, StyledNoResults, StyledClientsItem };
