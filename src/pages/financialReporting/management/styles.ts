import styled from "styled-components";
import {
  SkeletonLine as OriginalSkeletonLine,
  inube,
} from "@inubekit/inubekit";

export const ChatContent = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  font-size: 14px;
  color: #000000;
  font-family: Roboto;
  flex-direction: column;
  padding-right: 10px;
  margin-right: -8px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) =>
      theme?.palette?.neutral?.N30 || inube.palette.neutral.N30};
    border-radius: 8px;
  }
`;

export const SkeletonContainer = styled.div<{ type: "sent" | "received" }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ type }) => (type === "sent" ? "flex-end" : "flex-start")};
  margin: 10px;
`;

export const SkeletonLine = styled(OriginalSkeletonLine)`
  width: 20%;
  max-width: 100px;
  margin-bottom: 8px;
`;
