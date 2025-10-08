import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@inubekit/inubekit";
import { ScoreModal, ScoreModalProps } from "..";
import { scoreModalArgs } from "./props";

const meta: Meta<typeof ScoreModal> = {
  title: "components/modals/FrcModal",
  component: ScoreModal,
  argTypes: scoreModalArgs,
};

export default meta;

type Story = StoryObj<ScoreModalProps>;

export const Default: Story = (args: ScoreModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Open Score Modal</Button>
      {showModal && (
        <ScoreModal {...args} handleClose={() => setShowModal(false)} />
      )}
    </>
  );
};

Default.args = {
  businessManagerCode: "sistemasEnLinea",
  businessUnitPublicCode: "fondecom",
};
