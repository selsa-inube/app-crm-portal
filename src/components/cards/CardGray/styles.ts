import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const StyledContainer = styled.div`
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N10 || inube.palette.neutral.N10};
  border-radius: 8px;
  max-width: 100%;
`;

export const StyledTextField = styled.div`
  padding-right: 120px;
`;
