import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@inubekit/inubekit";

import { MaxLimitModal } from "..";
import { PaymentCapacityProps } from "..";
import { props } from "./props";

const meta: Meta<typeof MaxLimitModal> = {
  title: "components/modals/MaxLimitModal",
  component: MaxLimitModal,
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
          <MaxLimitModal {...args} handleClose={() => setShowModal(false)} />
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
