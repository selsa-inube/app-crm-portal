import { MdOutlineMessage, MdOutlinePushPin, MdPushPin } from "react-icons/md";
import { Stack, Icon, Text } from "@inubekit/inubekit";

import {
  truncateTextToMaxLength,
  capitalizeFirstLetter,
  capitalizeFirstLetterEachWord,
} from "@utils/formatData/text";
import { currencyFormat } from "@utils/formatData/currency";
import { formatPrimaryDate } from "@utils/formatData/date";

import { StyledSummaryCard, StyledDivider, StyledLink } from "./styles";
import { SummaryCardProps } from ".";

function SummaryCardUI(props: SummaryCardProps) {
  const {
    rad,
    date,
    name,
    destination,
    value,
    toDo,
    path,
    isPinned,
    hasMessage,
    onPinChange,
    errorLoadingPins,
  } = props;

  return (
    <StyledSummaryCard>
      <StyledLink to={path}>
        <Stack justifyContent="space-between">
          <Text size="small" appearance="gray">
            No. Rad.:{rad}
          </Text>
          <Text size="small" appearance="gray">
            {capitalizeFirstLetter(formatPrimaryDate(new Date(date)))}
          </Text>
        </Stack>
        <Text type="label">
          {capitalizeFirstLetterEachWord(truncateTextToMaxLength(name))}
        </Text>
        <Text size="medium" appearance="gray" weight="bold">
          Destino:
        </Text>
        <Text type="label">
          {capitalizeFirstLetter(truncateTextToMaxLength(destination, 60))}
        </Text>
        <Stack gap="8px">
          <Text size="medium" appearance="gray" weight="bold">
            Valor:
          </Text>
          <Text type="label">
            {value === 0 ? "$ 0" : currencyFormat(value)}
          </Text>
        </Stack>
        <Text size="medium" appearance="gray" weight="bold">
          Actividad en ejecución:
        </Text>
        <Text type="label">
          {capitalizeFirstLetter(truncateTextToMaxLength(toDo, 60))}
        </Text>
      </StyledLink>
      <Stack direction="column" padding="0px 8px">
        <StyledDivider />
        <Stack gap="8px" justifyContent="flex-end" padding="8px 0px">
          {hasMessage && (
            <Icon icon={<MdOutlineMessage />} appearance="dark" size="20px" />
          )}
          <Icon
            icon={isPinned ? <MdPushPin /> : <MdOutlinePushPin />}
            appearance={isPinned ? "dark" : "gray"}
            size="20px"
            cursorHover
            onClick={onPinChange}
            disabled={errorLoadingPins}
          />
        </Stack>
      </Stack>
    </StyledSummaryCard>
  );
}

export { SummaryCardUI };
