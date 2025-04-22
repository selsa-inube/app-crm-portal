import { useState } from "react";
import { FormikValues } from "formik";
import { MdAdd, MdCached } from "react-icons/md";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@inubekit/button";
import { action } from "@storybook/addon-actions";

import { props, parameters } from "./props";
import { ExtraDebtorModal, ExtraDebtorModalProps } from "..";

const meta: Meta<typeof ExtraDebtorModal> = {
  title: "components/modals/ExtraDebtorModal",
  component: ExtraDebtorModal,
  parameters: parameters,
  argTypes: props,
};

type Story = StoryObj<typeof ExtraDebtorModal>;

export const Create: Story = (args: ExtraDebtorModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const initialValues: FormikValues = {
    documentType: "",
    documentNumber: "",
    names: "",
    lastName: "",
    income: "",
    expenses: "",
    email: "",
    phone: "",
    gender: "",
    actions: "",
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Abrir Modal</Button>
      {showModal && (
        <ExtraDebtorModal
          {...args}
          initialValues={initialValues}
          onCloseModal={() => {
            setShowModal(false);
            action("onCloseModal")();
            args.onCloseModal();
          }}
          onConfirm={() => {
            setShowModal(false);
            action("onConfirm")();
            args.onConfirm();
          }}
        />
      )}
    </>
  );
};

Create.args = {
  title: "Agregar deudor extra",
  confirmButtonText: "Agregar",
  iconBefore: <MdAdd />,
};

export const Edit: Story = (args: ExtraDebtorModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const initialValues: FormikValues = {
    documentType: "Cedula",
    documentNumber: 1023632335,
    names: "Camilo",
    lastName: "Rincon",
    income: 5000000,
    expenses: 1500000,
    email: "camilo@inube.com",
    phone: 3123604555,
    gender: "Masculino",
    actions: "",
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Abrir Modal</Button>
      {showModal && (
        <ExtraDebtorModal
          {...args}
          initialValues={initialValues}
          onCloseModal={() => {
            setShowModal(false);
            action("onCloseModal")();
            args.onCloseModal();
          }}
          onConfirm={() => {
            setShowModal(false);
            action("onConfirm")();
            args.onConfirm();
          }}
        />
      )}
    </>
  );
};

Edit.args = {
  title: "Editar deudor extra",
  confirmButtonText: "Actualizar",
  iconAfter: <MdCached />,
};

export default meta;
