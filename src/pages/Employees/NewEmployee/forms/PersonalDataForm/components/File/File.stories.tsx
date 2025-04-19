import { Meta, StoryObj } from "@storybook/react";

import { File } from ".";

const meta: Meta<typeof File> = {
  title: "Components/input/File",
  component: File,
};

export default meta;

type Story = StoryObj<typeof File>;

export const Default: Story = {
  args: {
    withBorder: false,
    name: "Hoja_de_vida_Javier.pdf",
    size: "840 KB",
    onDelete: () => console.log("Archivo eliminado"),
  },
};
