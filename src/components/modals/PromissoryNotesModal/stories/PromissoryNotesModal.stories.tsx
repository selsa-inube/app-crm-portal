import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button } from "@inubekit/inubekit";
import { PromissoryNotesModal, PromissoryNotesModalProps } from "../index";
import { props } from "./props";

const story: Meta<typeof PromissoryNotesModal> = {
  component: PromissoryNotesModal,
  title: "components/modals/PromissoryNotesModal",
  argTypes: props,
};

const DefaultTemplate: StoryFn<PromissoryNotesModalProps> = (args) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const portalId = "portal";
  let portalNode = document.getElementById(portalId);
  if (!portalNode) {
    portalNode = document.createElement("div");
    portalNode.setAttribute("id", portalId);
    document.body.appendChild(portalNode);
  }

  return (
    <>
      <Button onClick={handleShowModal}>Open Modal</Button>
      {showModal && (
        <PromissoryNotesModal {...args} handleClose={handleShowModal} />
      )}
    </>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  title: "Confirma los datos del usuario",
  buttonText: "Enviar",
  formValues: {
    field1: "usuario@inube.com",
    field2: "3122638128",
    field3: "3122638128",
  },
};

export default story;
