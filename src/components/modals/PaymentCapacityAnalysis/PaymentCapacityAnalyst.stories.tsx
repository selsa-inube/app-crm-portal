import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@inubekit/inubekit";

import { PaymentCapacityAnalysis, IPaymentCapacityAnalysisProps } from ".";

type Story = StoryObj<typeof PaymentCapacityAnalysis>;

const shareCreditModal: Meta<typeof PaymentCapacityAnalysis> = {
  title: "components/modals/PaymentCapacityAnalysis",
  component: PaymentCapacityAnalysis,
};

export const Default: Story = (args: IPaymentCapacityAnalysisProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        Análisis de capacidad de pago
      </Button>
      {showModal && (
        <PaymentCapacityAnalysis
          {...args}
          handleClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

Default.args = {};

export default shareCreditModal;
