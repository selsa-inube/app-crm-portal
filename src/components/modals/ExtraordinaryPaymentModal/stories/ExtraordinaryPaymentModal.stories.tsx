import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@inubekit/button";

import { IExtraordinaryPayment } from "@services/types";
import { ExtraordinaryPaymentModalProps, ExtraordinaryPaymentModal } from "..";
import { parameters, props } from "./props";

const meta: Meta<typeof ExtraordinaryPaymentModal> = {
  title: "pages/propect/components/ExtraordinaryPaymentModal",
  component: ExtraordinaryPaymentModal,
  parameters,
  argTypes: props,
};

const dataTable: IExtraordinaryPayment[] = [
  {
    id: 1,
    datePayment: "Mar 25-26",
    value: 1500000,
    paymentMethod: "Selsa",
  },
  {
    id: 2,
    datePayment: "Mar 25-26",
    value: 1000000,
    paymentMethod: "Selsa",
  },
  {
    id: 3,
    datePayment: "Mar 25-26",
    value: 2000000,
    paymentMethod: "Prima",
  },
  {
    id: 4,
    datePayment: "Mar 25-26",
    value: 2500000,
    paymentMethod: "Cesantias",
  },
  {
    id: 5,
    datePayment: "Mar 25-26",
    value: 3000000,
    paymentMethod: "Cesantias",
  },
  {
    id: 6,
    datePayment: "Mar 25-26",
    value: 3500000,
    paymentMethod: "Prima",
  },
  {
    id: 7,
    datePayment: "Mar 25-26",
    value: 4000000,
    paymentMethod: "Selsa",
  },
  {
    id: 8,
    datePayment: "Mar 25-26",
    value: 4500000,
    paymentMethod: "Selsa",
  },
  {
    id: 9,
    datePayment: "Mar 25-26",
    value: 5000000,
    paymentMethod: "Prima",
  },
  {
    id: 10,
    datePayment: "Mar 25-26",
    value: 5500000,
    paymentMethod: "Cesantias",
  },
  {
    id: 11,
    datePayment: "Mar 25-26",
    value: 6000000,
    paymentMethod: "Cesantias",
  },
];

type Story = StoryObj<typeof ExtraordinaryPaymentModal>;
export const Default: Story = (args: ExtraordinaryPaymentModalProps) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button onClick={() => setShowModal(true)}>Show Modal</Button>
      {showModal && (
        <ExtraordinaryPaymentModal
          {...args}
          handleClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
Default.args = {
  dataTable,
  onClickDetails: (id) => console.log("Action Details", id),
  onClickEdit: (id) => console.log("Action Edit", id),
  onClickEliminate: (id) => console.log("Action Eliminate", id),
};

export const NoData: Story = (args: ExtraordinaryPaymentModalProps) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button onClick={() => setShowModal(true)}>Show Modal</Button>
      {showModal && (
        <ExtraordinaryPaymentModal
          {...args}
          handleClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
NoData.args = {
  dataTable: [],
  onClickDetails: (id) => console.log("Action Details", id),
  onClickEdit: (id) => console.log("Action Edit", id),
  onClickEliminate: (id) => console.log("Action Eliminate", id),
};

export default meta;
