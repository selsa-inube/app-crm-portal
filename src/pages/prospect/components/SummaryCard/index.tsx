import { SummaryCardUI } from "./interface";

interface SummaryCardProps {
  rad: string;
  date: string;
  name: string;
  destination: string;
  value: number;
  toDo: string;
  path: string;
  onCardClick?: () => void;
}

const SummaryCard = (props: SummaryCardProps) => {
  const { rad, date, name, destination, value, toDo, path, onCardClick } =
    props;

  return (
    <SummaryCardUI
      rad={rad}
      date={date}
      name={name}
      destination={destination}
      value={value}
      toDo={toDo}
      path={path}
      onCardClick={onCardClick}
    />
  );
};

export { SummaryCard };
export type { SummaryCardProps };
