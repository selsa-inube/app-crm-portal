import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button } from "@inubekit/inubekit";

import { DeleteAttachModal, DeleteAttachModalProps } from "..";

const story: Meta<typeof DeleteAttachModal> = {
  component: DeleteAttachModal,
  title: "modals/DeleteAttachModal",
};

const DefaultTemplate: StoryFn<DeleteAttachModalProps> = (args) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Button onClick={handleShowModal}>Open Modal</Button>
      {showModal && <DeleteAttachModal {...args} onCloseModal={handleShowModal} />}
    </>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  portalId: "portal",
};

export default story;
