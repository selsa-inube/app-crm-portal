import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Text, Button } from "@inubekit/inubekit";

import { BaseModal, IBaseModalProps } from ".";

type Story = StoryObj<typeof BaseModal>;

const baseModal: Meta<typeof BaseModal> = {
  title: "components/modals/baseModal",
  component: BaseModal,
};

export const Default: Story = (args: IBaseModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Modal Base</Button>
      {showModal && (
        <BaseModal
          {...args}
          handleNext={() => setShowModal(false)}
          handleBack={() => setShowModal(false)}
        />
      )}
    </>
  );
};

Default.args = {
  title: "Título",
  backButton: "Atrás",
  nextButton: "Siguiente",
  portalId: "portal",
  children: <Text>contenido</Text>,
  finalDivider: true,
  width: "400px",
  height: "auto",
};

export default baseModal;
