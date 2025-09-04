import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useState, useEffect } from "react";
import {
  Stack,
  Icon,
  Text,
  Divider,
  SkeletonLine,
  Textfield,
} from "@inubekit/inubekit";

import {
  currencyFormat,
  parseCurrencyString,
} from "@utils/formatData/currency";

import { StyledContainer, StyledTextField, StyledSupport } from "./styles";
import { incomeCardData } from "./config";
import { CardGray } from "../CardGray";

export interface IIncomeCardProps {
  title: string;
  labels: string[];
  placeholders: string[];
  values: string[];
  ShowSupport?: boolean;
  disabled?: boolean;
  onValueChange?: (index: number, newValue: string) => void;
}

export function IncomeCard(props: IIncomeCardProps) {
  const {
    title,
    labels,
    placeholders,
    values,
    ShowSupport,
    disabled = false,
    onValueChange,
  } = props;

  const [fieldValues, setFieldValues] = useState<string[]>([]);

  useEffect(() => {
    const formattedValues = values.map((val) =>
      currencyFormat(parseCurrencyString(val || "0")),
    );
    setFieldValues(formattedValues);
  }, [values]);

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newValue = event.target.value;
    const newValues = [...fieldValues];
    newValues[index] = newValue;
    setFieldValues(newValues);

    if (onValueChange) {
      onValueChange(index, newValue);
    }
  };

  return (
    <StyledContainer>
      <Stack
        direction="column"
        padding="16px"
        height={!ShowSupport ? "auto" : "318px"}
        gap="8px"
      >
        <Text size="medium" type="title" weight="bold">
          {title}
        </Text>
        <Divider />
        <Stack direction="column" padding="10px 8px">
          {!disabled && (
            <>
              {values.length === 0
                ? Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonLine key={index} />
                  ))
                : labels.map((label, index) => (
                    <StyledTextField key={index}>
                      <Text type="label" weight="bold" size="medium">
                        {label}
                      </Text>
                      <Textfield
                        name={`field${index}`}
                        id={`field${index}`}
                        placeholder={placeholders[index] || ""}
                        value={fieldValues[index] || ""}
                        onChange={(event) => handleFieldChange(event, index)}
                        size="compact"
                        disabled={disabled}
                        fullwidth
                      />
                    </StyledTextField>
                  ))}
            </>
          )}
          {disabled && (
            <Stack direction="column" padding="16px 0px" gap="12px">
              {labels.map((label, index) => (
                <CardGray
                  key={index}
                  label={label}
                  placeHolder={fieldValues[index] || ""}
                />
              ))}
            </Stack>
          )}
        </Stack>
        {ShowSupport && (
          <Stack justifyContent="end" margin="auto 12px 5px 0px">
            <StyledSupport onClick={() => console.log("Ver soporte")}>
              <Stack gap="8px" alignItems="center">
                <Text appearance="primary" type="label" size="large">
                  {incomeCardData.support}
                </Text>
                <Icon
                  icon={<MdOutlineRemoveRedEye />}
                  size="15px"
                  appearance="primary"
                  variant="filled"
                  shape="circle"
                />
              </Stack>
            </StyledSupport>
          </Stack>
        )}
      </Stack>
    </StyledContainer>
  );
}
