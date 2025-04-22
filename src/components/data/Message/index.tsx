import { formatPrimaryDate } from "@utils/formatData/date";

import {
  MessageWrapper,
  MessageContent,
  Timestamp,
  IconWrapper,
} from "./styles";
export interface MessageProps {
  type: "sent" | "received";
  timestamp: number | string;
  message: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

const formatDate = (timestamp: number | string) => {
  return formatPrimaryDate(new Date(timestamp), true);
};

export const Message: React.FC<MessageProps> = ({
  type,
  timestamp,
  message,
  icon,
  onIconClick,
}) => {
  return (
    <MessageWrapper type={type}>
      <MessageContent type={type}>
        <IconWrapper type={type} onClick={onIconClick} role="button">
          {icon}
        </IconWrapper>
        {message}
      </MessageContent>
      <Timestamp type={type}>{formatDate(timestamp)}</Timestamp>
    </MessageWrapper>
  );
};
