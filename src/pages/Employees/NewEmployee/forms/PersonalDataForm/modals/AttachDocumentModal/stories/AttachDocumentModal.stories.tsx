import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button } from "@inubekit/inubekit";

import { AttachDocumentModal, AttachDocumentModalProps } from "..";

const story: Meta<typeof AttachDocumentModal> = {
  component: AttachDocumentModal,
  title: "modals/AttachDocumentModal",
};

const DefaultTemplate: StoryFn<AttachDocumentModalProps> = (args) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Button onClick={handleShowModal}>Open Modal</Button>
      {showModal && <AttachDocumentModal {...args} onCloseModal={handleShowModal} />}
    </>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  portalId: "portal",
};

export default story;
