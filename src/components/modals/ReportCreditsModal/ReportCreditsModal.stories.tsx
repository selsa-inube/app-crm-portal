import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@inubekit/inubekit";

import { ReportCreditsModal, ReportCreditsModalProps } from ".";
import { incomeOptions } from "@src/pages/prospect/outlets/CardCommercialManagement/config/config";

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
  totalFee: 3300000,
  totalBalance: 87000000,
  onChange: () => {},
  options: incomeOptions,
  debtor: "John Doe",
};

export { Default };
export default meta;
