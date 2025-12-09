import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 260px;
  height: 270px;
  border-radius: 8px;
  background-color: ${({ theme }) =>
    theme?.palette?.neutral?.N0 || inube.palette.neutral.N0};
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);
`;
