import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { Stack, Icon, Text } from "@inubekit/inubekit";

import {
  truncateTextToMaxLength,
  capitalizeFirstLetter,
} from "@utils/formatData/text";
import { currencyFormat } from "@utils/formatData/currency";
import { getScheduleInSpanish } from "@utils/mappingData/mappings";

import { StyledCreditProductCard, StyledDivider, StyledPrint } from "./styles";
import { CREDIT_PRODUCT_TEXTS } from "./config";
import { CreditProductCardProps } from ".";

function CreditProductCardUI(props: CreditProductCardProps) {
  const {
    lineOfCredit,
    paymentMethod,
    loanAmount,
    interestRate,
    termMonths,
    periodicFee,
    schedule,
    onEdit,
    onDelete,
  } = props;

  return (
    <StyledCreditProductCard>
      <Stack direction="column" height="100%" padding="12px" gap="8px">
        <Text size="large" appearance="gray" weight="bold" margin="0px 0px 8px">
          {capitalizeFirstLetter(truncateTextToMaxLength(lineOfCredit, 22))}
        </Text>

        <Stack direction="column">
          <Text size="small" appearance="gray" weight="bold">
            {CREDIT_PRODUCT_TEXTS.paymentMethod}
          </Text>
          <Text>
            {capitalizeFirstLetter(truncateTextToMaxLength(paymentMethod, 40))}
          </Text>
        </Stack>
        <Stack direction="column">
          <Text size="small" appearance="gray" weight="bold">
            {CREDIT_PRODUCT_TEXTS.loanAmount}
          </Text>
          <Text>{loanAmount === 0 ? "$ 0" : currencyFormat(loanAmount)}</Text>
        </Stack>
        <Stack direction="column">
          <Text size="small" appearance="gray" weight="bold">
            {CREDIT_PRODUCT_TEXTS.interestRate}
          </Text>
          <Text>{interestRate} %</Text>
        </Stack>
        <Stack direction="column">
          <Text size="small" appearance="gray" weight="bold">
            {CREDIT_PRODUCT_TEXTS.termMonths}
          </Text>
          <Text>{termMonths}</Text>
        </Stack>
        <Stack direction="column">
          <Text size="small" appearance="gray" weight="bold">
            {CREDIT_PRODUCT_TEXTS.periodicFee}
          </Text>
          <Text>{periodicFee === 0 ? "$ 0" : currencyFormat(periodicFee)}</Text>
        </Stack>
        <Stack direction="column">
          <Text size="small" appearance="gray" weight="bold">
            {CREDIT_PRODUCT_TEXTS.paymentCycle}
          </Text>
          <Text>
            {capitalizeFirstLetter(
              truncateTextToMaxLength(getScheduleInSpanish(schedule), 22),
            )}
          </Text>
        </Stack>
      </Stack>
      <Stack direction="column" padding="0px 12px">
        <StyledPrint>
          <StyledDivider />
          <Stack gap="8px" justifyContent="flex-end" padding="8px 0px">
            <Icon
              icon={<MdOutlineEdit />}
              appearance="primary"
              size="24px"
              cursorHover
              onClick={onEdit}
            />
            <Icon
              icon={<MdOutlineDelete />}
              appearance="primary"
              size="24px"
              cursorHover
              onClick={onDelete}
            />
          </Stack>
        </StyledPrint>
      </Stack>
    </StyledCreditProductCard>
  );
}

export { CreditProductCardUI };
