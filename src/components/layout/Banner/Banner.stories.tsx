import { Meta } from "@storybook/react";

import { VinculationBanner, VinculationBannerProps } from "./index";

const meta: Meta<typeof VinculationBanner> = {
  title: "components/VinculationBanner",
  component: VinculationBanner,
  argTypes: {
    status: {
      control: "select",
      options: [
        "Prospecto",
        "En proceso de vinculación",
        "En proceso de retiro",
        "Retirado",
        "Activo",
      ],
    },
  },
};

export const Default = (args: VinculationBannerProps) => <VinculationBanner {...args} />;

Default.args = {
  name: "José Manuel Hernández Díaz",
  status: "Activo",
};

export default meta;
