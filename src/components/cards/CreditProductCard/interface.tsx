import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { Stack, Icon, Text } from "@inubekit/inubekit";

import { capitalizeFirstLetter } from "@utils/formatData/text";
import { currencyFormat } from "@utils/formatData/currency";
import { TruncatedText } from "@components/modals/TruncatedTextModal";

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
    showIcons,
    onEdit,
    onDelete,
  } = props;

  return (
    <StyledCreditProductCard $showIcons={showIcons}>
      <Stack direction="column" height="100%" padding="12px" gap="8px">
        <Stack margin="0px 0px 8px">
          <TruncatedText
            text={lineOfCredit}
            maxLength={22}
            size="large"
            weight="bold"
            appearance="gray"
            transformFn={capitalizeFirstLetter}
          />
        </Stack>
        <Stack direction="column">
          <Text size="small" appearance="gray" weight="bold">
            {CREDIT_PRODUCT_TEXTS.paymentMethod}
          </Text>
          <TruncatedText
            text={paymentMethod}
            maxLength={22}
            transformFn={capitalizeFirstLetter}
          />
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
          <Text>{parseFloat(Number(interestRate).toFixed(4))} %</Text>
        </Stack>
        <Stack direction="column">
          <Text size="small" appearance="gray" weight="bold">
            {CREDIT_PRODUCT_TEXTS.termMonths}
          </Text>
          <Text>
            {termMonths % 1 !== 0 ? termMonths.toFixed(4) : termMonths}
          </Text>
        </Stack>
        <Stack direction="column">
          <Text size="small" appearance="gray" weight="bold">
            {CREDIT_PRODUCT_TEXTS.periodicFee}
          </Text>
          <Text>
            {periodicFee === 0
              ? "$ 0"
              : currencyFormat(Math.trunc(periodicFee))}
          </Text>
        </Stack>
        <Stack direction="column">
          <Text size="small" appearance="gray" weight="bold">
            {CREDIT_PRODUCT_TEXTS.paymentCycle}
          </Text>
          <TruncatedText
            text={schedule}
            maxLength={22}
            transformFn={capitalizeFirstLetter}
          />
        </Stack>
      </Stack>
      <Stack direction="column" padding="0px 12px">
        {showIcons && (
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
        )}
      </Stack>
    </StyledCreditProductCard>
  );
}

export { CreditProductCardUI };
