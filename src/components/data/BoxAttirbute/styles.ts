import { inube } from "@inubekit/inubekit";
import styled from "styled-components";

export const StyledBoxAttribute = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;
  word-wrap: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  padding: 6px 16px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${inube.palette.neutral.N10};
`;
