import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface MessageProps {
  type: "sent" | "received";
}

export const MessageWrapper = styled.div<MessageProps>`
  display: flex;
  flex-direction: column;
  align-items: ${({ type }) => (type === "sent" ? "flex-end" : "flex-start")};
  margin: 10px;
`;

export const MessageContent = styled.div<MessageProps>`
  display: flex;
  font-family: Roboto;
  color: ${({ theme }) =>
    theme?.palette?.neutral?.N900 || inube.palette.neutral.N900};
  max-width: 35%;
  padding: 7px;
  border-radius: 4px;
  background-color: ${({ type }) => (type === "sent" ? "#DEEBFF" : "#F4F5F7")};
  border: 1px solid ${({ type }) => (type === "sent" ? "#B3D4FF" : "#DFE1E6")};
  position: relative;
  &::after {
    content: "";
    position: absolute;
    border-width: 10px;
    border-style: solid;
    border-color: transparent;
    top: 0px;
    ${({ type }) =>
      type === "sent"
        ? `
      right: -10px;
      border-left-color: #DEEBFF;
      border-right: none;
      border-top: none;
    `
        : `
      left: -10px;
      border-right-color: #F4F5F7;
      border-left: none;
      border-top: none;
    `}
  }
`;

export const Timestamp = styled.div<MessageProps>`
  font-size: 10px;
  font-family: Roboto;
  color: #000000;
  align-self: ${({ type }) => (type === "sent" ? "flex-end" : "flex-start")};
  margin-top: 5px;
  margin-left: 10px;
  margin-right: 10px;
`;

export const IconWrapper = styled.div<MessageProps>`
  align-items: center;
  align-content: center;
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin-right: 8px;
  border-radius: 2px;
  svg {
    color: ${({ theme }) =>
      theme?.palette?.neutral?.N900 || inube.palette.neutral.N900};
    transition: color 0.2s ease-in-out;

    &:hover {
      color: #007bff;
    }
  }
`;
