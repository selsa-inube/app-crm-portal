import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@inubekit/inubekit";

import { ExtraordinaryPaymentModalProps, ExtraordinaryPaymentModal } from "..";
import { parameters, props } from "./props";

const meta: Meta<typeof ExtraordinaryPaymentModal> = {
  title: "pages/propect/components/ExtraordinaryPaymentModal",
  component: ExtraordinaryPaymentModal,
  parameters,
  argTypes: props,
};

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
Default.args = {};

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
NoData.args = {};

export default meta;
