import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@inubekit/inubekit";

import { ConsolidatedCredits } from "..";
import { ConsolidatedCreditsProps } from "..";

const meta: Meta<typeof ConsolidatedCredits> = {
  title: "pages/prospect/components/modals/ConsolidatedCreditModal",
  component: ConsolidatedCredits,
};

export default meta;

type Story = StoryObj<ConsolidatedCreditsProps>;

export const Default: Story = {
  render: (args) => {
    const [showModal, setShowModal] = useState(false);

    return (
      <>
        <Button onClick={() => setShowModal(true)}>Consolidated Modal</Button>
        {showModal && (
          <ConsolidatedCredits
            {...args}
            handleClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  },
};
