import { Meta } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";

import { AppMenu, AppMenuProps } from ".";

const meta: Meta<typeof AppMenu> = {
  title: "layout/AppMenu",
  component: AppMenu,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    appName: { control: "text" },
    appRoute: { control: "object" },
    children: { control: "text" },
    appDescription: { control: "text" },
  },
};

export const Default = (args: AppMenuProps) => (
  <AppMenu {...args}>
    <p>Content inside the AppMenu component</p>
  </AppMenu>
);

Default.args = {
  appName: "Sample Application",
  appRoute: [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
  ],
  appDescription: "A brief description of the application",
  children: <p>Sample child content goes here</p>,
};

export default meta;
