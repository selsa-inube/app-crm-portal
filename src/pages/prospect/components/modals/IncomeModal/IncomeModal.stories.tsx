import { useState } from "react";

import { Meta, StoryFn } from "@storybook/react";
import { Button } from "@inubekit/button";

import { IncomeModal, IncomeModalProps } from ".";

const meta: Meta<typeof IncomeModal> = {
  title: "prospect/components/modals/IncomeModal",
  component: IncomeModal,
};

export const Default: StoryFn<IncomeModalProps> = (args) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Modal Income</Button>
      {showModal && (
        <IncomeModal {...args} handleClose={() => setShowModal(false)} />
      )}
    </>
  );
};

Default.args = {};

export default meta;
