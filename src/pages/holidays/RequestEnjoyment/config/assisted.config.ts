import { IAssistedStep, IOption } from "@inubekit/inubekit";

export const requestEnjoymentSteps: IAssistedStep[] = [
  {
    id: 1,
    number: 1,
    name: "Información general",
    description: "Proporciona información acerca de tu solicitud.",
  },
  {
    id: 2,
    number: 2,
    name: "Requisitos no cumplidos",
    description: "Revisa los requisitos para el disfrute de vacaciones.",
  },
  {
    id: 3,
    number: 3,
    name: "Verificación",
    description: "Verifica la información proporcionada.",
  },
];

export const certificationOptions: IOption[] = [
  {
    id: "1",
    label: "Certificado de servidor",
    value: "certificado de servidor",
  },
  {
    id: "2",
    label: "Certificado de pertenencia a empresa",
    value: "certificado de pertenencia a empresa",
  },
  {
    id: "3",
    label: "Certificado de representante",
    value: "certificado de representante",
  },
];

export const contractOptions: IOption[] = [
  {
    id: "1",
    label: "Contrato por obra o labor",
    value: "contrato por obra o labor.",
  },
  {
    id: "2",
    label: "Contrato de trabajo a término fijo",
    value: "contrato de trabajo a término fijo.",
  },
  {
    id: "3",
    label: "Contrato de trabajo a término indefinido",
    value: "contrato de trabajo a término indefinido.",
  },
];
