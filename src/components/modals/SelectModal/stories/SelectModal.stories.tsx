import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button, IOption } from "@inubekit/inubekit";

import { SelectModal, SelectModalProps } from "..";

const selectionOptions: IOption[] = [
  { id: "1", label: "contract1", value: "contract1" },
  { id: "2", label: "contract2", value: "contract2" },
  { id: "3", label: "contract3", value: "contract3" },
];

const story: Meta<typeof SelectModal> = {
  component: SelectModal,
  title: "components/modals/SelectModal",
};

const DefaultTemplate: StoryFn<SelectModalProps> = (args) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Button onClick={handleShowModal}>Open Modal</Button>
      {showModal && <SelectModal {...args} onCloseModal={handleShowModal} />}
    </>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  title: "Selecciona un contrato",
  description: "Selecciona el contrato sobre el que vas a ejecutar la acción seleccionada.",
  portalId: "portal",
  selectionOptions,
};

export default story;
