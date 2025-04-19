import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button } from "@inubekit/inubekit";

import { mockAlertCards } from "@mocks/requirements/requirements.mock";

import { RequirementsModal, RequirementsModalProps } from "..";

const story: Meta<typeof RequirementsModal> = {
  component: RequirementsModal,
  title: "modals/RequirementsModal",
};

const DefaultTemplate: StoryFn<RequirementsModalProps> = (args) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Button onClick={handleShowModal}>Open Modal</Button>
      {showModal && (
        <RequirementsModal {...args} onCloseModal={handleShowModal} alertCards={mockAlertCards} />
      )}
    </>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  portalId: "portal",
};

export default story;
