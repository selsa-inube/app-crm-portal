import { useState } from "react";
import { FormikValues } from "formik";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Button } from "@inubekit/inubekit";
import { MdAdd, MdCached } from "react-icons/md";

import { props, parameters } from "./props";
import {
  EditFinancialObligationModal,
  IEditFinancialObligationModalProps,
} from "..";

const editFinancialObligationModal: Meta<typeof EditFinancialObligationModal> =
  {
    title: "components/modals/editFinancialObligationModal",
    component: EditFinancialObligationModal,
    parameters: parameters,
    argTypes: props,
  };

type Story = StoryObj<typeof EditFinancialObligationModal>;

export const Create: Story = (args: IEditFinancialObligationModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const initialValues: FormikValues = {
    fee: "",
    balance: "",
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Abrir Modal</Button>
      {showModal && (
        <EditFinancialObligationModal
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

export const Edit: Story = (args: IEditFinancialObligationModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const initialValues: FormikValues = {
    fee: 600000,
    balance: 10000000,
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Abrir Modal</Button>
      {showModal && (
        <EditFinancialObligationModal
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

export default editFinancialObligationModal;
