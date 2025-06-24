import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button } from "@inubekit/inubekit";

import { props, parameters } from "./props";
import { AddSeriesModal } from "../index";
import { AddSeriesModalProps } from "../index";

const story: Meta<typeof AddSeriesModal> = {
  component: AddSeriesModal,
  title: "components/modals/AddSeriesModal",
  argTypes: props,
  parameters: parameters,
};

const DefaultTemplate: StoryFn<AddSeriesModalProps> = (args) => {
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
      {showModal && <AddSeriesModal {...args} handleClose={handleShowModal} />}
    </>
  );
};

export const Default = DefaultTemplate.bind();
export default story;
