import { MdOutlineDoorFront } from "react-icons/md";

export const homeTitleConfig = (username: string) => ({
  title: `Bienvenido, ${username}`,
  description: "Aquí tienes las funcionalidades disponibles.",
  icon: <MdOutlineDoorFront />,
  sizeTitle: "large" as const,
});

export const errorDataCredit = {
  noBusinessUnit:
    "No hay una unidad de negocio relacionada con el código del portal.",
  noSelectClient: "No se ha seleccionado ningún cliente.",
  errorData: "No se han podido obtener las opciones de personal.",
  noData: "Este cliente aún no tiene funcionalidades disponibles.",
};
