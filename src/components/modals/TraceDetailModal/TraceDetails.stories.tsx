import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@inubekit/inubekit";

import { TraceDetailModal, ITraceDetailsModalProps } from ".";

type Story = StoryObj<typeof TraceDetailModal>;

const traceDetailsModal: Meta<typeof TraceDetailModal> = {
  title: "components/modals/TraceDetailModal",
  component: TraceDetailModal,
};

export const Default: Story = (args: ITraceDetailsModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Modal Trace Details</Button>
      {showModal && (
        <TraceDetailModal {...args} handleClose={() => setShowModal(false)} />
      )}
    </>
  );
};

Default.args = {
  isMobile: false,
};

export default traceDetailsModal;
