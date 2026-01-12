import { EnumType } from "@hooks/useEnum/useEnum";

import { SummaryCardUI } from "./interface";

interface SummaryCardProps {
  rad: string;
  date: string;
  name: string;
  destination: string;
  value: number;
  toDo: string;
  hasMessage: boolean;
  lang: EnumType;
  onCardClick?: () => void;
}

const SummaryCard = (props: SummaryCardProps) => {
  const {
    rad,
    date,
    name,
    destination,
    value,
    toDo,
    hasMessage,
    lang,
    onCardClick,
  } = props;

  return (
    <SummaryCardUI
      rad={rad}
      date={date}
      name={name}
      destination={destination}
      value={value}
      toDo={toDo}
      hasMessage={hasMessage}
      onCardClick={onCardClick}
      lang={lang}
    />
  );
};

export { SummaryCard };
export type { SummaryCardProps };
