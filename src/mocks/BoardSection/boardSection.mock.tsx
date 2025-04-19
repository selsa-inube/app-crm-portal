import { SectionBackground, SectionOrientation } from "@components/layout/BoardSection/types";

interface BoardSectionProps {
  sectionTitle: string;
  sectionBackground: SectionBackground;
  orientation: SectionOrientation;
  sectionInformation: {
    creditRequestCode: string;
    clientName: string;
    creditRequestDateOfCreation: string;
    userWhoPinnnedId: string;
    title: string;
    count: string;
    message: string;
  }[];
  errorLoadingPins: boolean;
  searchRequestValue: string;
}

export const boardSectionConfig: Record<string, BoardSectionProps> = {
  Default: {
    sectionTitle: "BoardSectionTitle",
    sectionBackground: "gray",
    orientation: "vertical",
    sectionInformation: [
      {
        creditRequestCode: "12345",
        clientName: "John Doe",
        creditRequestDateOfCreation: "2023-03-15",
        userWhoPinnnedId: "user123",
        title: "Solicitud de Crédito",
        count: "1",
        message: "Mensaje de prueba",
      },
    ],
    errorLoadingPins: false,
    searchRequestValue: "",
  },
  ThreeRequests: {
    sectionTitle: "Tres Solicitudes",
    sectionBackground: "light",
    orientation: "vertical",
    sectionInformation: [
      {
        creditRequestCode: "00123",
        clientName: "Alice Johnson",
        creditRequestDateOfCreation: "2024-01-05",
        userWhoPinnnedId: "user111",
        title: "Crédito Hipotecario",
        count: "1",
        message: "Pendiente",
      },
      {
        creditRequestCode: "00456",
        clientName: "Bob Williams",
        creditRequestDateOfCreation: "2024-02-10",
        userWhoPinnnedId: "user222",
        title: "Crédito Automotriz",
        count: "2",
        message: "Aprobado",
      },
      {
        creditRequestCode: "00789",
        clientName: "Charlie Brown",
        creditRequestDateOfCreation: "2024-03-15",
        userWhoPinnnedId: "user333",
        title: "Préstamo Personal",
        count: "3",
        message: "En revisión",
      },
    ],
    errorLoadingPins: false,
    searchRequestValue: "",
  },
  FiveRequests: {
    sectionTitle: "Cinco Solicitudes",
    sectionBackground: "gray",
    orientation: "horizontal",
    sectionInformation: [
      {
        creditRequestCode: "10001",
        clientName: "Daniel García",
        creditRequestDateOfCreation: "2023-12-01",
        userWhoPinnnedId: "user444",
        title: "Crédito Empresarial",
        count: "5",
        message: "En proceso",
      },
      {
        creditRequestCode: "10002",
        clientName: "Elena Martínez",
        creditRequestDateOfCreation: "2023-12-05",
        userWhoPinnnedId: "user555",
        title: "Microcrédito",
        count: "2",
        message: "Aprobado",
      },
      {
        creditRequestCode: "10003",
        clientName: "Fernando López",
        creditRequestDateOfCreation: "2023-12-10",
        userWhoPinnnedId: "user666",
        title: "Crédito de Consumo",
        count: "3",
        message: "Pendiente",
      },
      {
        creditRequestCode: "10004",
        clientName: "Gabriela Rojas",
        creditRequestDateOfCreation: "2023-12-15",
        userWhoPinnnedId: "user777",
        title: "Crédito de Estudios",
        count: "1",
        message: "En revisión",
      },
      {
        creditRequestCode: "10005",
        clientName: "Héctor Ramírez",
        creditRequestDateOfCreation: "2023-12-20",
        userWhoPinnnedId: "user888",
        title: "Crédito Hipotecario",
        count: "4",
        message: "Finalizado",
      },
    ],
    errorLoadingPins: false,
    searchRequestValue: "",
  },
};
