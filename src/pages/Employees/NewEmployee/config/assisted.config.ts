import { IAssistedStep } from "@inubekit/inubekit";

export const newEmployeeSteps: IAssistedStep[] = [
  {
    id: 1,
    number: 1,
    name: "Datos personales",
    description: "Completa los datos personales del empleado.",
  },
  {
    id: 2,
    number: 2,
    name: "Datos de posición contractual",
    description: "Diligencia los datos solicitados.",
  },
  {
    id: 3,
    number: 3,
    name: "Ubicación jurídica y contable",
    description: "Define la asignación contable del empleado.",
  },
  {
    id: 4,
    number: 4,
    name: "Asignaciones",
    description: "Despliega las asignaciones seleccionadas.",
  },
  {
    id: 5,
    number: 5,
    name: "Requisitos no cumplidos",
    description: "Aspectos que son un impedimento y deben cambiar.",
  },
  {
    id: 6,
    number: 6,
    name: "Verificación",
    description: "Confirma la información diligenciada.",
  },
];
