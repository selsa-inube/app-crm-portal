import { SectionBackground } from "@components/layout/BoardSection/types";

type BoardColumn = {
  id: string;
  value: string;
  sectionBackground: SectionBackground;
};

const boardColumns: BoardColumn[] = [
  {
    id: "GESTION_COMERCIAL",
    value: "Gestión Comercial",
    sectionBackground: "gray",
  },
  {
    id: "VERIFICACION_APROBACION",
    value: "Verificación y Aprobación",
    sectionBackground: "light",
  },
  {
    id: "FORMALIZACION_GARANTIAS",
    value: "Formalización Garantías",
    sectionBackground: "gray",
  },
  {
    id: "TRAMITE_DESEMBOLSO",
    value: "Trámite Desembolso",
    sectionBackground: "light",
  },
  {
    id: "CUMPLIMIENTO_REQUISITOS",
    value: "Cumplimiento Requisitos",
    sectionBackground: "gray",
  },
];

export { boardColumns };
