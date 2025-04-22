import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@inubekit/button";

import { PaymentCapacity } from "..";
import { PaymentCapacityProps } from "..";
import { props } from "./props";

const meta: Meta<typeof PaymentCapacity> = {
  title: "components/modals/PaymentCapacityModal",
  component: PaymentCapacity,
  argTypes: props,
};

export default meta;

type Story = StoryObj<PaymentCapacityProps>;

export const Default: Story = (args: PaymentCapacityProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Abrir Modal</Button>
      {showModal && (
        <>
          <PaymentCapacity {...args} handleClose={() => setShowModal(false)} />
        </>
      )}
    </>
  );
};
Default.args = {
  title: "Cupo máx. capacidad de pago",
  reportedIncomeSources: 5000000,
  reportedFinancialObligations: 1000000,
  subsistenceReserve: 200000,
  availableForNewCommitments: 800000,
  maxVacationTerm: 60,
  maxAmount: 2000000,
};
