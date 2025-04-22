import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@inubekit/button";

import { traceDetailsMock } from "@mocks/financialReporting/trace-details/tracedetails.mock";

import { TraceDetailsModal, ITraceDetailsModalProps } from ".";

type Story = StoryObj<typeof TraceDetailsModal>;

const traceDetailsModal: Meta<typeof TraceDetailsModal> = {
  title: "components/modals/traceDetailsModal",
  component: TraceDetailsModal,
};

export const Default: Story = (args: ITraceDetailsModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Modal Trace Details</Button>
      {showModal && (
        <TraceDetailsModal {...args} handleClose={() => setShowModal(false)} />
      )}
    </>
  );
};

Default.args = {
  isMobile: false,
  data: traceDetailsMock[0],
};

export default traceDetailsModal;
