import { MdOutlineMessage } from "react-icons/md";
import { Stack, Icon, Text, Divider } from "@inubekit/inubekit";

import {
  truncateTextToMaxLength,
  capitalizeFirstLetter,
  capitalizeFirstLetterEachWord,
} from "@utils/formatData/text";
import { currencyFormat } from "@utils/formatData/currency";
import { formatPrimaryDate } from "@utils/formatData/date";

import { SummaryCardProps } from ".";
import { StyledSummaryCard, StyledLink } from "./styles";
import { summaryData } from "./config";

function SummaryCardUI(props: SummaryCardProps) {
  const { rad, date, name, destination, value, toDo, path, onCardClick } =
    props;
  return (
    <StyledSummaryCard>
      <StyledLink to={path} onClick={onCardClick}>
        <Stack justifyContent="space-between">
          <Stack>
            <Text type="body" size="small" appearance="gray">
              {summaryData.numFiled}
            </Text>
            <Text type="body" size="small" weight="bold" appearance="gray">
              {rad}
            </Text>
          </Stack>
          <Text type="body" size="small" appearance="gray">
            {capitalizeFirstLetter(formatPrimaryDate(new Date(date)))}
          </Text>
        </Stack>
        <Text type="body" size="large" weight="bold">
          {capitalizeFirstLetterEachWord(truncateTextToMaxLength(name))}
        </Text>
        <Text type="title" size="small" appearance="gray" weight="bold">
          {summaryData.destination}
        </Text>
        <Text type="body" size="medium">
          {capitalizeFirstLetter(truncateTextToMaxLength(destination, 60))}
        </Text>
        <Stack gap="8px">
          <Text type="title" size="small" appearance="gray" weight="bold">
            {summaryData.value}
          </Text>
          <Text type="body" size="medium">
            {value === 0 ? "$ 0" : currencyFormat(value)}
          </Text>
        </Stack>
        <Text type="title" size="small" appearance="gray" weight="bold">
          {summaryData.activity}
        </Text>
        <Text type="body" size="medium">
          {capitalizeFirstLetter(truncateTextToMaxLength(toDo, 60))}
        </Text>
      </StyledLink>
      <Stack direction="column" padding="0px 8px">
        <Divider />
        <Stack gap="8px" justifyContent="flex-end" padding="8px 0px">
          <Icon icon={<MdOutlineMessage />} appearance="dark" size="20px" />
        </Stack>
      </Stack>
    </StyledSummaryCard>
  );
}

export { SummaryCardUI };
