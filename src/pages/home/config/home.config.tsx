import { MdOutlineDoorFront } from "react-icons/md";

export const homeTitleConfig = (username: string) => ({
  title: `Bienvenido, ${username}`,
  description: "Aquí tienes las funcionalidades disponibles.",
  icon: <MdOutlineDoorFront />,
  sizeTitle: "large" as const,
});
