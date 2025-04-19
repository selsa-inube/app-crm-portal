import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button, IOption } from "@inubekit/inubekit";

import { AddAssignmentModal, AddAssignmentModalProps } from "..";

const assignmentOptions: IOption[] = [
  { id: "1", label: "Sueldo básico", value: "sueldo_basico" },
  { id: "2", label: "Auxilio de conectividad", value: "auxilio_conectividad" },
  { id: "3", label: "Otro", value: "otro" },
];

const story: Meta<typeof AddAssignmentModal> = {
  component: AddAssignmentModal,
  title: "modals/AddAssignmentModal",
};

const DefaultTemplate: StoryFn<AddAssignmentModalProps> = (args) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Button onClick={handleShowModal}>Open Modal</Button>
      {showModal && <AddAssignmentModal {...args} onCloseModal={handleShowModal} />}
    </>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  portalId: "portal",
  assignmentOptions,
};

export default story;
