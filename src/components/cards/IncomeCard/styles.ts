import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const StyledContainer = styled.div`
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  box-shadow: 0px 2px 6px
    ${({ theme }) => theme?.palette?.neutral?.N40 || inube.palette.neutral.N40};
  border-radius: 8px;
  border: solid 1px
    ${({ theme }) => theme?.palette?.neutral?.N70 || inube.palette.neutral.N70};
  overflow: hidden;
`;

export const StyledTextField = styled.div`
  margin: 5px 0px;
  div > div:nth-child(2) {
    background-color: ${({ theme }) =>
      theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  }
`;

export const StyledSupport = styled.div`
  cursor: pointer;
`;
