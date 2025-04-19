type SectionBackground = "gray" | "light";

type SectionOrientation = "horizontal" | "vertical";

interface ICreditRequest {
  creditRequestCode?: string;
  clientName?: string;
  creditRequestDateOfCreation?: string;
  userWhoPinnnedId?: string;
  title: string;
  count: string;
  message: string;
}

interface IBoardSectionProps {
  sectionTitle: string;
  sectionBackground: SectionBackground;
  orientation: SectionOrientation;
  sectionInformation: ICreditRequest[];
  errorLoadingPins: boolean;
  searchRequestValue: string;
  CardComponent: React.FC<{ request: ICreditRequest }>;
}

export type { SectionBackground, SectionOrientation, ICreditRequest, IBoardSectionProps };
