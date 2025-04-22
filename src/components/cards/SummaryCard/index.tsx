import { SummaryCardUI } from "./interface";

interface SummaryCardProps {
  rad: string;
  date: string;
  name: string;
  destination: string;
  value: number;
  toDo: string;
  path: string;
  isPinned?: boolean;
  hasMessage?: boolean;
  onPinChange?: () => void;
  errorLoadingPins?: boolean;
}

const SummaryCard = (props: SummaryCardProps) => {
  const {
    rad,
    date,
    name,
    destination,
    value,
    toDo,
    path,
    isPinned = false,
    hasMessage,
    onPinChange,
    errorLoadingPins,
  } = props;

  return (
    <SummaryCardUI
      rad={rad}
      date={date}
      name={name}
      destination={destination}
      value={value}
      toDo={toDo}
      path={path}
      isPinned={isPinned}
      hasMessage={hasMessage}
      onPinChange={onPinChange}
      errorLoadingPins={errorLoadingPins}
    />
  );
};

export { SummaryCard };
export type { SummaryCardProps };
