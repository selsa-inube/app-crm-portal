import { Meta, StoryObj } from "@storybook/react";
import { useMediaQuery } from "@inubekit/inubekit";

import { parameters, props } from "./props";

import { RequestComponentDetailProps } from "../index";
import { RequestComponentDetail } from "../index";

const meta: Meta<typeof RequestComponentDetail> = {
  title: "components/modals/RequestComponentDetail",
  component: RequestComponentDetail,
  parameters,
  argTypes: props,
};

type Story = StoryObj<typeof RequestComponentDetail>;

const getModalContent = (isMobile: boolean) => {
  const fullContent = [
    { label: "Número", value: "1234" },
    { label: "Tipo", value: "Disfrute de vacaciones" },
    { label: "Fecha", value: "22/Oct/2024" },
    { label: "Estado", value: "En trámite de aprobación" },
    { label: "Destinatario", value: "A quien interese" },
    { label: "Contrato", value: "21338 - Sistemas En Línea S.A - Indefinido" },
    {
      label: "Observaciones",
      value:
        "Me gustaría que uno de los asesores se contactaran vía telefónica, si es posible, ya que me quedan ciertas dudas que no se solucionan mediante la pagina. Agradecería una llamada al numero celular 312 3202874.",
    },
  ];

  return isMobile
    ? fullContent
    : fullContent.filter((item) =>
        ["Destinatario", "Contrato", "Observaciones"].includes(item.label),
      );
};

export const Default: Story = (args: RequestComponentDetailProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const modalContent = getModalContent(isMobile);

  return <RequestComponentDetail {...args} modalContent={modalContent} />;
};

Default.args = {
  title: "Detalles",
  portalId: "portal",
  buttonLabel: "Cerrar",
};

export default meta;
