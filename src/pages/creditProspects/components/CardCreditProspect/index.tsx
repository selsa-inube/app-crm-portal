import { Stack, Icon, Text, Divider } from "@inubekit/inubekit";
import {
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlineSend,
  MdOutlineMessage,
} from "react-icons/md";

import { CardGray } from "@components/cards/CardGray";
import { IconText } from "@pages/prospect/components/IconText";
import { currencyFormat } from "@utils/formatData/currency";
import { capitalizeFirstLetter } from "@utils/formatData/text";
import { formatPrimaryDate } from "@utils/formatData/date";

import { StyledContainer } from "./styles";
import { cardCreditData } from "./config";

export interface ICardCreditProspectProps {
  title: string;
  borrower: string;
  numProspect: string;
  date: Date;
  value: number;
  isMobile: boolean;
  iconTitle: string;
  hasMessage?: boolean;
  handleMessage?: () => void;
  handleSend?: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
}

export function CardCreditProspect(props: ICardCreditProspectProps) {
  const {
    title,
    borrower,
    numProspect,
    date,
    value,
    isMobile,
    iconTitle,
    hasMessage,
    handleMessage,
    handleSend = () => {},
    handleEdit = () => {},
    handleDelete = () => {},
  } = props;

  return (
    <StyledContainer $isMobile={isMobile}>
      <Stack direction="column" padding="10px 16px" gap="12px">
        <Stack justifyContent="space-between">
          <Stack gap="12px">
            <Icon
              icon={<IconText icon={iconTitle} />}
              appearance="dark"
              size="24px"
            />
            <Text type="title" size="medium" weight="bold" appearance="dark">
              {title}
            </Text>
          </Stack>
          {hasMessage && (
            <Icon
              icon={<MdOutlineMessage />}
              appearance="primary"
              size="20px"
              onClick={handleMessage}
              cursorHover
            />
          )}
        </Stack>
        <Divider dashed />
        <Stack direction="column" gap="8px">
          <CardGray
            label={cardCreditData.official}
            placeHolder={borrower}
            apparencePlaceHolder="gray"
          />
          <CardGray
            label={cardCreditData.numProspect}
            placeHolder={numProspect}
            apparencePlaceHolder="gray"
          />
          <CardGray
            label={cardCreditData.date}
            placeHolder={capitalizeFirstLetter(
              formatPrimaryDate(new Date(date)),
            )}
            apparencePlaceHolder="gray"
          />
          <CardGray
            label={cardCreditData.value}
            placeHolder={value === 0 ? "$ 0" : currencyFormat(value)}
            apparencePlaceHolder="gray"
          />
        </Stack>
        <Stack direction="column" gap="12px">
          <Divider />
          <Stack gap="10px" justifyContent="flex-end">
            <Icon
              icon={<MdOutlineSend />}
              appearance="primary"
              size="20px"
              onClick={handleSend}
              cursorHover
            />
            <Icon
              icon={<MdOutlineEdit />}
              appearance="dark"
              size="20px"
              onClick={handleEdit}
              cursorHover
            />
            <Icon
              icon={<MdOutlineDelete />}
              appearance="danger"
              size="20px"
              onClick={handleDelete}
              cursorHover
            />
          </Stack>
        </Stack>
      </Stack>
    </StyledContainer>
  );
}
