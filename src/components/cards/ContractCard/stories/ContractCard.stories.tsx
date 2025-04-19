import { BrowserRouter } from "react-router-dom";
import { StoryFn, Meta } from "@storybook/react";

import { ContractCard, ContractCardProps } from "..";

const meta: Meta<typeof ContractCard> = {
  component: ContractCard,
  title: "components/cards/ContractCard",
  decorators: [
    (Story: StoryFn) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

const Template: StoryFn<ContractCardProps> = (args) => <ContractCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  isContractValid: true,
  lastSalary: 3290000,
  startDate: "02/Sep/2024",
  endDate: "31/Dic/2025",
  lastCharge: "Cargo anterior",
  contractType: "Tiempo completo",
  normativeFramework: "Marco XYZ",
  company: "Empresa ABC",
};

export const InvalidContract = Template.bind({});
InvalidContract.args = {
  ...Default.args,
  isContractValid: false,
};

export default meta;
