import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@inubekit/inubekit";
import { action } from "@storybook/addon-actions";
import { MdAdd, MdCached } from "react-icons/md";

import { props, parameters } from "./props";
import { FinancialObligationModal, FinancialObligationModalProps } from "..";

const financialObligationModal: Meta<typeof FinancialObligationModal> = {
  title: "components/modals/financialObligationModal",
  component: FinancialObligationModal,
  parameters: parameters,
  argTypes: props,
};

type Story = StoryObj<typeof FinancialObligationModal>;

export const Create: Story = (args: FinancialObligationModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Abrir Modal</Button>
      {showModal && (
        <FinancialObligationModal
          {...args}
          onCloseModal={() => {
            setShowModal(false);
            action("onCloseModal")();
            args.onCloseModal();
          }}
          onConfirm={(values) => {
            setShowModal(false);
            action("onConfirm")();
            args.onConfirm(values);
          }}
        />
      )}
    </>
  );
};

Create.args = {
  title: "Agregar Obligacion",
  confirmButtonText: "Agregar",
  iconBefore: <MdAdd />,
};

export const Edit: Story = (args: FinancialObligationModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Abrir Modal</Button>
      {showModal && (
        <FinancialObligationModal
          {...args}
          onCloseModal={() => {
            setShowModal(false);
            action("onCloseModal")();
            args.onCloseModal();
          }}
          onConfirm={(values) => {
            setShowModal(false);
            action("onConfirm")();
            args.onConfirm(values);
          }}
        />
      )}
    </>
  );
};

Edit.args = {
  title: "Nombre de producto",
  confirmButtonText: "Actualizar",
  iconAfter: <MdCached />,
};

export default financialObligationModal;
