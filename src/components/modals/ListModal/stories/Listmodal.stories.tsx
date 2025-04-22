import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@inubekit/button";
import { Text } from "@inubekit/inubekit";

import { IListModalProps, ListModal } from "..";
import { parameters, props } from "./props";

const meta: Meta<typeof ListModal> = {
  title: "components/modals/ListModal",
  component: ListModal,
  parameters,
  argTypes: props,
};

type Story = StoryObj<typeof ListModal>;
export const Default: Story = (args: IListModalProps) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button onClick={() => setShowModal(true)}>Modal List</Button>
      {showModal && (
        <ListModal {...args} handleClose={() => setShowModal(false)} />
      )}
    </>
  );
};
Default.args = {
  title: "Title",
  portalId: "portal",
  content: <Text>contenido sobre del modal</Text>,
  buttonLabel: "Close",
};

export default meta;
