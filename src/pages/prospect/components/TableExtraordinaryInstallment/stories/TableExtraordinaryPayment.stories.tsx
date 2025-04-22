import type { Meta, StoryObj } from "@storybook/react";

import { props } from "./props";
import { TableExtraordinaryInstallment } from "..";

type Story = StoryObj<typeof TableExtraordinaryInstallment>;

const meta: Meta<typeof TableExtraordinaryInstallment> = {
  title: "components/data/TableExtraordinaryInstallment",
  component: TableExtraordinaryInstallment,
  argTypes: props,
};

export const Default: Story = {};
export default meta;
