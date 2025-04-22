import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@inubekit/inubekit";

import { DeductibleExpensesModal } from ".";
import type { DeductibleExpensesModalProps } from ".";

const meta: Meta<typeof DeductibleExpensesModal> = {
  title: "pages/prospect/components/modals/DeductibleExpensesModal",
  component: DeductibleExpensesModal,
};

export default meta;

type Story = StoryObj<typeof DeductibleExpensesModal>;

export const Default: Story = {
  render: (args: DeductibleExpensesModalProps) => {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <Button onClick={() => setShowModal(true)}>
          Modal Deductible Expenses
        </Button>
        {showModal && (
          <DeductibleExpensesModal
            {...args}
            handleClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  },
};
