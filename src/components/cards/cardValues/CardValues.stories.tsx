import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CardValues, CardValuesProps } from "./index";
import { ListModal } from "@components/modals/ListModal";

export default {
  title: "Components/cards/CardValues",
  component: CardValues,
} as Meta<typeof CardValues>;

const Template: StoryObj<CardValuesProps> = {
  render: (args) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleIconClick = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    return (
      <>
        <CardValues {...args} onIconClick={handleIconClick} />
        {isModalOpen && (
          <ListModal
            title="Resumen Prospectivo"
            handleClose={handleCloseModal}
            buttonLabel="Cerrar"
            content={<div>Contenido del modal</div>}
          />
        )}
      </>
    );
  },
};

export const Default: StoryObj<CardValuesProps> = {
  ...Template,
  args: {
    items: [{ title: "Obligaciones recogidas", amount: "$5.000.000" }],
  },
};

export const WithoutIcon: StoryObj<CardValuesProps> = {
  ...Template,
  args: {
    items: [
      { title: "Monto prestamo", amount: "$16.000.000" },
      { title: "Obligaciones recogidas", amount: "$5.000.000" },
      { title: "Gastos descontables", amount: "$1.000.000" },
      { title: "Neto a girar", amount: "$10.000.000" },
      { title: "Cuotas ordinarias", amount: "$1.200.000" },
    ],
    showIcon: false,
  },
};
