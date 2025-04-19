import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button } from "@inubekit/inubekit";

import { TextAreaModal, TextAreaModalProps } from "..";
import { props } from "./props";

const story: Meta<typeof TextAreaModal> = {
  component: TextAreaModal,
  title: "components/modals/TextAreaModal",
  argTypes: props,
};

const DefaultTemplate: StoryFn<TextAreaModalProps> = (args) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Button onClick={handleShowModal}>Open Modal</Button>
      {showModal && <TextAreaModal {...args} onCloseModal={handleShowModal} />}
    </>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  title: "Default Title",
  buttonText: "Submit",
  inputLabel: "Input Label",
  inputPlaceholder: "Type something...",
  maxLength: 200,
  portalId: "portal",
};

export default story;
