import styled from "styled-components";
import { inube } from "@inubekit/inubekit";

interface MessageProps {
  type: "sent" | "received" | "system";
}

export const MessageWrapper = styled.div<MessageProps>`
  display: flex;
  flex-direction: column;
  align-items: ${({ type }) =>
    ({
      sent: "flex-end",
      received: "flex-start",
      system: "center",
    })[type]};
  margin: 10px;
`;

export const MessageContent = styled.div<MessageProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${({ type }) =>
    type === "system" ? "center" : "flex-start"};
  flex-direction: row;
  font-family: Roboto;
  color: ${({ theme }) =>
    theme?.palette?.neutral?.N900 || inube.palette.neutral.N900};
  width: 260px;
  padding: 7px;
  border-radius: 4px;
  background-color: ${({ type }) =>
    ({ sent: "#DEEBFF", received: "#F4F5F7", system: "#FAFBFC" })[type]};
  border: 1px solid
    ${({ type }) =>
      ({ sent: "#B3D4FF", received: "#DFE1E6", system: "#5E6C84" })[type]};
  word-break: break-word;

  ${({ type }) =>
    type !== "system" &&
    `
      &::after {
        content: "";
        position: absolute;
        border-width: 10px;
        border-style: solid;
        border-color: transparent;
        top: 0px;
        ${
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
        `
        }
      }
    `}
`;

export const IconWrapper = styled.div<MessageProps>`
  ${({ type }) =>
    type === "sent"
      ? `
        margin-right: 8px;
        position: relative;
      `
      : `
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
      `}
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    color: ${({ theme }) =>
      theme?.palette?.neutral?.N900 || inube.palette.neutral.N900};
    transition: color 0.2s ease-in-out;

    &:hover {
      color: #007bff;
    }
  }
`;

export const Timestamp = styled.div<MessageProps>`
  font-size: 10px;
  font-family: Roboto;
  color: #000000;
  align-self: ${({ type }) =>
    ({
      sent: "flex-end",
      received: "flex-start",
      system: "center",
    })[type]};
  margin-top: 5px;
  margin-left: 10px;
  margin-right: 10px;
`;
