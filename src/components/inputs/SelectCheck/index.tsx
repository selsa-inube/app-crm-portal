import { useEffect, useRef, useState } from "react";

import { IOptionItemCheckedProps } from "./OptionItem";
import { Size, Status } from "./types";
import { SelectcheckUI } from "./interface";

export interface ISelectcheckProps {
  id: string;
  name: string;
  value: string | number;
  options: IOptionItemCheckedProps[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  status?: Status;
  message?: string;
  size?: Size;
  fullwidth?: boolean;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeCheck?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Selectcheck = (props: ISelectcheckProps) => {
  const {
    label,
    name,
    id,
    placeholder,
    disabled = false,
    readonly = false,
    value,
    required = false,
    status = "pending",
    message,
    size = "wide",
    fullwidth = false,
    options,
    onBlur,
    onFocus,
    onChange,
    onClick,
    onChangeCheck,
  } = props;

  const [focused, setFocused] = useState(false);
  const [displayList, setDisplayList] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setDisplayList(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectRef]);

  const handleFocus = (e: FocusEvent) => {
    setFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e: FocusEvent) => {
    setFocused(false);
    onBlur && onBlur(e);
  };

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readonly) return;
    onClick && onClick(e);
    setDisplayList(!displayList);
  };

  return (
    <SelectcheckUI
      ref={selectRef}
      label={label}
      name={name}
      id={id}
      placeholder={placeholder}
      disabled={disabled}
      readonly={readonly}
      value={value}
      required={required}
      size={size}
      status={status}
      message={message}
      fullwidth={fullwidth}
      focused={focused}
      options={options}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={onChange}
      onClick={handleClick}
      displayList={displayList}
      onChangeCheck={onChangeCheck}
    />
  );
};
