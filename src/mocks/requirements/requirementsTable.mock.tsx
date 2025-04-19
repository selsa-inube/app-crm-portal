import { Tag } from "@inubekit/inubekit";

import { Requirement } from "@components/data/TableBoard/types";

export const mockRequirements: Requirement[] = [
  {
    id: "system-validations",
    titles: [
      {
        id: "Validaciones del sistema",
        titleName: "Validaciones del sistema",
        priority: 1,
      },
      { id: "tag", titleName: "", priority: 2 },
    ],
    entries: [
      {
        id: "sv-1",
        "Validaciones del sistema": "Que el asociado sea activo",
        tag: <Tag label="Cumple" appearance="success" weight="strong" />,
      },
      {
        id: "sv-2",
        "Validaciones del sistema": "Que este al día con las obligaciones",
        tag: <Tag label="Cumple" appearance="success" weight="strong" />,
      },
      {
        id: "sv-3",
        "Validaciones del sistema": "Que tenga más de 30 años",
        tag: <Tag label="No Cumple" appearance="danger" weight="strong" />,
      },
    ],
  },
  {
    id: "documentary-requirements",
    titles: [
      {
        id: "Requisitos documentales",
        titleName: "Requisitos documentales",
        priority: 1,
      },
      { id: "tag", titleName: "", priority: 2 },
    ],
    entries: [
      {
        id: "dr-1",
        "Requisitos documentales": "Imágenes de la Cédula de ciudadanía",
        tag: <Tag label="Cumple" appearance="success" weight="strong" />,
      },
      {
        id: "dr-2",
        "Requisitos documentales": "Desprendible de pago",
        tag: <Tag label="Sin Evaluar" appearance="warning" weight="strong" />,
      },
      {
        id: "dr-3",
        "Requisitos documentales": "Declaración de renta",
        tag: <Tag label="Sin Evaluar" appearance="warning" weight="strong" />,
      },
    ],
  },
  {
    id: "human-validations",
    titles: [
      {
        id: "Validaciones humanas",
        titleName: "Validaciones humanas",
        priority: 1,
      },
      { id: "tag", titleName: "", priority: 2 },
    ],
    entries: [
      {
        id: "hv-1",
        "Validaciones humanas": "Referencias laborales",
        tag: <Tag label="Cumple" appearance="success" weight="strong" />,
      },
      {
        id: "hv-2",
        "Validaciones humanas": "Proponer un codeudor",
        tag: <Tag label="No Cumple" appearance="danger" weight="strong" />,
      },
    ],
  },
];
