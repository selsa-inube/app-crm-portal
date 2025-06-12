import { useState, useRef } from "react";
import { MdClear } from "react-icons/md";
import { Stack, Text, Tag, Divider, Button } from "@inubekit/inubekit";

import { formatPrimaryDate } from "@utils/formatData/date";
import { currencyFormat } from "@utils/formatData/currency";

import { StyledContainer, StyledInput } from "./styles";
import { dataConsolidatedCredit } from "./config";

export interface ICardConsolidatedCreditProps {
  onUpdateTotal: (oldValue: number, newValue: number, label?: string) => void;
  title: string;
  code: string;
  expiredValue: number;
  nextDueDate: number;
  fullPayment: number;
  date: Date;
  isMobile?: boolean;
  arrears?: boolean;
  initialValue?: number;
}

export function CardConsolidatedCredit(props: ICardConsolidatedCreditProps) {
  const {
    onUpdateTotal,
    title,
    code,
    expiredValue,
    nextDueDate,
    fullPayment,
    isMobile,
    arrears,
    date = new Date(),
    initialValue,
  } = props;

  const hasInitialValue = initialValue !== undefined && initialValue > 0;

  const [isRadioSelected, setIsRadioSelected] = useState(hasInitialValue);
  const [selectedValue, setSelectedValue] = useState<number | null>(
    hasInitialValue ? initialValue : null,
  );

  const radioRefs = useRef<HTMLInputElement[]>([]);

  const paymentOptions = [
    {
      label: dataConsolidatedCredit.expiredValue,
      value: expiredValue,
    },
    {
      label: dataConsolidatedCredit.nextDueDate,
      value: nextDueDate,
      date: date,
    },
    {
      label: dataConsolidatedCredit.fullPayment,
      value: fullPayment,
    },
  ];

  const handleSelectionChange = (value: number, label: string) => {
    if (selectedValue !== value) {
      onUpdateTotal(selectedValue || 0, value, label);
      setSelectedValue(value);
    }
    setIsRadioSelected(true);
  };

  const handleClearSelection = () => {
    if (isRadioSelected && selectedValue !== null) {
      onUpdateTotal(selectedValue, 0);
      setSelectedValue(null);
      setIsRadioSelected(false);
      radioRefs.current.forEach((radio) => {
        if (radio) radio.checked = false;
      });
    }
  };

  return (
    <StyledContainer disabled={isRadioSelected} $isMobile={isMobile}>
      <Stack
        direction="column"
        padding={isMobile ? "16px 10px" : "16px 20px"}
        gap="16px"
        width="256px"
      >
        <Text type="label" size="large" weight="bold">
          {title}
        </Text>
        <Divider dashed />
        <Text type="body" size="medium" appearance="gray">
          {code}
        </Text>
        <Stack justifyContent="space-between">
          <Tag
            label={dataConsolidatedCredit.regularPayroll}
            appearance="gray"
            weight="strong"
          />
          {arrears && (
            <Tag
              label={dataConsolidatedCredit.arrears}
              appearance="danger"
              weight="strong"
            />
          )}
        </Stack>
        <Stack direction="column" gap="8px">
          {paymentOptions.map((option, index) => (
            <StyledInput
              key={index}
              onClick={() => {
                radioRefs.current[index]?.click();
                handleSelectionChange(option.value, option.label);
              }}
            >
              <Stack alignItems="center" justifyContent="space-between">
                <Stack>
                  <input
                    type="radio"
                    name={`paymentOption-${code}`}
                    ref={(el) => (radioRefs.current[index] = el!)}
                    onChange={() =>
                      handleSelectionChange(option.value, option.label)
                    }
                  />
                  <Stack direction="column">
                    <Text type="label" size="medium" weight="bold">
                      {option.label}
                    </Text>
                    {option.date && (
                      <Text type="body" size="small" appearance="gray">
                        {formatPrimaryDate(option.date)}
                      </Text>
                    )}
                  </Stack>
                </Stack>
                <Text type="body" size="small" appearance="gray">
                  {currencyFormat(option.value)}
                </Text>
              </Stack>
            </StyledInput>
          ))}
        </Stack>
        <Stack justifyContent="space-between" alignItems="end">
          <Button
            children="Desmarcar"
            iconBefore={<MdClear />}
            variant="outlined"
            appearance={isRadioSelected ? "primary" : "gray"}
            spacing="compact"
            onClick={handleClearSelection}
          />
          <Text type="title" size="medium" weight="bold" appearance="gray">
            {currencyFormat(selectedValue || 0)}
          </Text>
        </Stack>
      </Stack>
    </StyledContainer>
  );
}
