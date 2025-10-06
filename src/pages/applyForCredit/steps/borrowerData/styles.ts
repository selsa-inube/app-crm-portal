import { inube } from "@inubekit/inubekit";
import styled from "styled-components";

export const StyledContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 10px 10px 20px 10px;

  &::-webkit-scrollbar {
    width: 80px;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) =>
      theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
    border-radius: 8px;
  }
`;
