import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@inubekit/inubekit";

import { OfferedGuaranteeModal, IOfferedGuaranteeModalProps } from ".";

type Story = StoryObj<typeof OfferedGuaranteeModal>;

const offeredGuaranteeModal: Meta<typeof OfferedGuaranteeModal> = {
  title: "components/modals/OfferedGuaranteeModal",
  component: OfferedGuaranteeModal,
};

export const Default: Story = (args: IOfferedGuaranteeModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        Modal Offered Guarantee
      </Button>
      {showModal && (
        <OfferedGuaranteeModal
          {...args}
          handleClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

Default.args = {
  isMobile: false,
};

export default offeredGuaranteeModal;
