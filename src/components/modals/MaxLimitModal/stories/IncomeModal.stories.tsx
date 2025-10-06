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
  businessManagerCode: "sistemasEnLinea",
  businessUnitPublicCode: "fondecom",
};
