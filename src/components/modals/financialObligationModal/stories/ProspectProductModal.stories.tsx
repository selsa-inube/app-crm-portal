import { useState } from "react";
import { FormikValues } from "formik";
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
  const initialValues: FormikValues = {
    type: "",
    entity: "",
    fee: "",
    balance: "",
    payment: "",
    idUser: "",
    feePaid: "",
    term: "",
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Abrir Modal</Button>
      {showModal && (
        <FinancialObligationModal
          {...args}
          initialValues={initialValues}
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
  const initialValues: FormikValues = {
    type: "Consumo",
    entity: "Bancolombia",
    fee: 600000,
    balance: 10000000,
    payment: "Caja",
    idUser: 12546,
    feePaid: "5",
    term: "60",
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Abrir Modal</Button>
      {showModal && (
        <FinancialObligationModal
          {...args}
          initialValues={initialValues}
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
