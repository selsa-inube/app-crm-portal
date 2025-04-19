import { Meta, StoryFn } from "@storybook/react";

import { ConfirmDeleteModal } from ".";

export default {
  title: "Modals/ConfirmDeleteModal",
  component: ConfirmDeleteModal,
  decorators: [
    (Story: StoryFn) => (
      <div id="portal">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof ConfirmDeleteModal>;

const Template: StoryFn<typeof ConfirmDeleteModal> = (args) => <ConfirmDeleteModal {...args} />;

export const Default = Template.bind({});
Default.args = {
  onConfirmDelete: (justification: string) => {
    console.log("Justification:", justification);
  },
  onCloseModal: () => {
    console.log("Modal closed");
  },
};
