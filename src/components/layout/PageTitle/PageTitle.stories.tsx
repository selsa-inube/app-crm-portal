import { Meta } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

import { PageTitle, PageTitleProps } from ".";

const meta: Meta<typeof PageTitle> = {
  title: "layout/PageTitle",
  component: PageTitle,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    title: { control: "text" },
    icon: { control: "object" },
    description: { control: "text" },
    navigatePage: { control: "text" },
  },
};

export const Default = (args: PageTitleProps) => <PageTitle {...args} />;

Default.args = {
  title: "Sample Page Title",
  description: "This is a brief description of the page.",
  navigatePage: "/home",
  icon: <MdArrowBack />,
};

export default meta;
