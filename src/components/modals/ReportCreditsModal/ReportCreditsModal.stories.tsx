import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@inubekit/inubekit";

import { incomeOptions } from "@pages/prospect/outlets/CardCommercialManagement/config/config";

import { ReportCreditsModal, ReportCreditsModalProps } from ".";

const meta: Meta<typeof ReportCreditsModal> = {
  title: "components/modals/ReportCreditsModal",
  component: ReportCreditsModal,
};

type Story = StoryObj<ReportCreditsModalProps>;

const Default: Story = (args: ReportCreditsModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Modal Report Credit</Button>
      {showModal && (
        <ReportCreditsModal {...args} handleClose={() => setShowModal(false)} />
      )}
    </>
  );
};

Default.args = {
  onChange: () => {},
  options: incomeOptions,
  debtor: "John Doe",
};

export { Default };
export default meta;
