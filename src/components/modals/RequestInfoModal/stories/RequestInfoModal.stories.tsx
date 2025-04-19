import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button } from "@inubekit/inubekit";

import { RequestInfoModal, RequestInfoModalProps } from "..";
import { props } from "./props";

const story: Meta<typeof RequestInfoModal> = {
  component: RequestInfoModal,
  title: "components/modals/RequestInfoModal",
  argTypes: props,
};

const DefaultTemplate: StoryFn<RequestInfoModalProps> = (args) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Button onClick={handleShowModal}>Open Modal</Button>
      {showModal && <RequestInfoModal {...args} onCloseModal={handleShowModal} />}
    </>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  requestId: "#45678822",
  staffName: "Nombre Nombre Apellido Apellido",
};

export default story;
