import { IOptionItemCheckedProps } from "@components/inputs/SelectCheck/OptionItem";

const selectCheckOptions: IOptionItemCheckedProps[] = [
  { id: "1", label: "Solo los míos", checked: false },
  { id: "2", label: "Todos los pendientes de algún tramite", checked: false },
  { id: "3", label: "En Gestión Comercial", checked: false },
  { id: "4", label: "En Verificación y Aprobación", checked: false },
  { id: "5", label: "Formalización y Garantías", checked: false },
  { id: "6", label: "En trámite de desembolso", checked: false },
  { id: "7", label: "En Cumplimiento de Garantías Pos", checked: false },
  { id: "8", label: "Finalizados hace menos de 30 días", checked: false },
  { id: "9", label: "En atención del Cliente", checked: false },
  { id: "10", label: "Con comentarios sin leer", checked: false },
  { id: "11", label: "Sin asignar responsable", checked: false },
];

export { selectCheckOptions };
