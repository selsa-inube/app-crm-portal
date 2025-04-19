import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button } from "@inubekit/inubekit";

import { SendRequestModal, SendRequestModalProps } from "..";
import { props } from "./props";

const story: Meta<typeof SendRequestModal> = {
  component: SendRequestModal,
  title: "components/modals/SendRequestModal",
  argTypes: props,
};

const DefaultTemplate: StoryFn<SendRequestModalProps> = (args) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Button onClick={handleShowModal}>Open Modal</Button>
      {showModal && <SendRequestModal {...args} onCloseModal={handleShowModal} />}
    </>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  descriptionText: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
};

export default story;
