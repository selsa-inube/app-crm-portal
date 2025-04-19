import { Meta, StoryObj } from "@storybook/react";

import { mockRequirements } from "@mocks/requirements/requirementsTable.mock";

import { parameters, props } from "./props";
import { RequirementsModalProps } from "../index";
import { RequirementsModal } from "../index";

const meta: Meta<typeof RequirementsModal> = {
  title: "components/modals/RequirementsModal",
  component: RequirementsModal,
  parameters,
  argTypes: props,
};

type Story = StoryObj<typeof RequirementsModal>;

export const Default: Story = (args: RequirementsModalProps) => {
  return <RequirementsModal {...args} />;
};

Default.args = {
  title: "Requisitos",
  portalId: "portal",
  buttonLabel: "Cerrar",
  requirements: mockRequirements,
};

export default meta;
