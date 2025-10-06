import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@inubekit/inubekit";

import { ReciprocityModal, ReciprocityModalProps } from ".";
const meta: Meta<typeof ReciprocityModal> = {
  title: "components/modals/ReciprocityModal",
  component: ReciprocityModal,
};

type Story = StoryObj<ReciprocityModalProps>;

const Default: Story = (args: ReciprocityModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Modal Reciprocity</Button>
      {showModal && (
        <ReciprocityModal {...args} handleClose={() => setShowModal(false)} />
      )}
    </>
  );
};
Default.args = {
  businessManagerCode: "sistemasEnLinea",
  businessUnitPublicCode: "fondecom",
};

export { Default };
export default meta;
