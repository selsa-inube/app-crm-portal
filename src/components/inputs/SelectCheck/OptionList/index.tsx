import { StyledOptionList } from "./styles";

export interface OptionListProps {
  children: JSX.Element | JSX.Element[];
  onClick?: React.ChangeEventHandler<HTMLInputElement>;
}

const OptionList = (props: OptionListProps) => {
  const { children, onClick } = props;

  return <StyledOptionList onClick={onClick}>{children}</StyledOptionList>;
};

export { OptionList };
