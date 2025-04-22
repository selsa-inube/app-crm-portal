import { forwardRef } from "react";
import {
  MdOutlineError,
  MdCheckCircle,
  MdOutlineArrowDropDown,
} from "react-icons/md";
import { Label } from "@inubekit/label";
import { Stack, Icon, Text } from "@inubekit/inubekit";

import { OptionItemChecked } from "./OptionItem";
import { OptionList } from "./OptionList";
import { Size } from "./types";
import { StyledContainer, StyledInputContainer, StyledInput } from "./styles";
import { textConfig } from "./config";
import { ISelectcheckProps } from ".";

export interface ISelectcheckUIProps extends ISelectcheckProps {
  focused?: boolean;
  displayList: boolean;
}

const getTypo = (size: Size) => {
  if (size === "compact") {
    return "medium";
  }
  return "large";
};

const Message = (
  props: Pick<ISelectcheckProps, "disabled" | "status"> & { message?: string },
) => {
  const { disabled, status, message } = props;

  return (
    status !== "pending" && (
      <Stack alignItems="center" gap="4px" margin="4px 0 0 16px">
        <Icon
          appearance={status === "invalid" ? "danger" : "success"}
          disabled={disabled}
          icon={status === "invalid" ? <MdOutlineError /> : <MdCheckCircle />}
          size="14px"
        />
        <Text
          type="body"
          size="small"
          appearance={status === "invalid" ? "danger" : "success"}
          disabled={disabled}
        >
          {message && `${message}`}
        </Text>
      </Stack>
    )
  );
};

export const SelectcheckUI = forwardRef<HTMLDivElement, ISelectcheckUIProps>(
  (props: ISelectcheckUIProps, ref) => {
    const {
      label,
      name,
      id,
      placeholder,
      disabled,
      readonly,
      required,
      status,
      message,
      size,
      value,
      fullwidth,
      options,
      focused,
      onFocus,
      onBlur,
      onClick,
      onChange,
      displayList,
      onChangeCheck,
    } = props;

    return (
      <StyledContainer $fullwidth={fullwidth} disabled={disabled} ref={ref}>
        {(required || label) && (
          <Stack
            alignItems="center"
            margin="0px 0px 4px 0px"
            padding="0px 0px 0px 16px"
            gap="4px"
          >
            <Label
              htmlFor={id}
              disabled={disabled}
              focused={!readonly && focused}
              invalid={status === "invalid" && !readonly}
              size={getTypo(size!)}
              margin="0px 0px 0px 2px"
            >
              {label}
            </Label>

            {required && !disabled && (
              <Text type="body" size="small" appearance="dark">
                {textConfig.requiredText}
              </Text>
            )}
          </Stack>
        )}

        <StyledInputContainer
          disabled={disabled}
          $focused={focused!}
          $status={status}
          onClick={onClick}
          $readonly={readonly}
        >
          <StyledInput
            autoComplete="off"
            readOnly
            value={value}
            name={name}
            id={id}
            placeholder={placeholder}
            disabled={disabled}
            $required={required}
            $size={size}
            $status={status}
            $fullwidth={fullwidth}
            $focused={focused!}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={onChange}
            onClick={onClick}
          />

          {!readonly && (
            <Icon
              appearance="dark"
              icon={<MdOutlineArrowDropDown />}
              size="24px"
              spacing="narrow"
              disabled={disabled}
            />
          )}
        </StyledInputContainer>

        {status && !readonly && (
          <Message disabled={disabled} status={status} message={message} />
        )}
        {displayList && !disabled && (
          <OptionList onClick={onChangeCheck}>
            {options.map((optionItem) => (
              <OptionItemChecked
                key={optionItem.id}
                id={optionItem.id}
                label={optionItem.label}
                checked={optionItem.checked}
                onchange={onChangeCheck}
              />
            ))}
          </OptionList>
        )}
      </StyledContainer>
    );
  },
);
