import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button } from "@inubekit/inubekit";

import { InfoModal, InfoModalProps } from "..";
import { props } from "./props";

const story: Meta<typeof InfoModal> = {
  component: InfoModal,
  title: "components/modals/InfoModal",
  argTypes: props,
};

const DefaultTemplate: StoryFn<InfoModalProps> = (args) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Button onClick={handleShowModal}>Open Modal</Button>
      {showModal && <InfoModal {...args} onCloseModal={handleShowModal} />}
    </>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  title: "Información",
  titleDescription: "¿Por qué está inhabilitado?",
  description:
    "Solo es posible renovar los contratos a término fijo, en este caso no se encontró ningún contrato que cumpla con los requisitos.",
};

export default story;
