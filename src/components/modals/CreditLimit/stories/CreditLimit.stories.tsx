import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@inubekit/inubekit";

import { CreditLimit, ICreditLimitProps } from "..";
import { props } from "./props";

const meta: Meta<typeof CreditLimit> = {
  title: "components/modals/CreditLimit",
  component: CreditLimit,
  parameters: {
    backgrounds: { default: "light" },
  },
  argTypes: props,
};

export default meta;

type Story = StoryObj<typeof CreditLimit>;

export const Default: Story = (args: ICreditLimitProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Abrir Modal</Button>
      {showModal && (
        <>
          <CreditLimit {...args} handleClose={() => setShowModal(false)} />
        </>
      )}
    </>
  );
};

Default.args = {
  businessManagerCode: "sistemasEnLinea",
  businessUnitPublicCode: "fondecom",
};
