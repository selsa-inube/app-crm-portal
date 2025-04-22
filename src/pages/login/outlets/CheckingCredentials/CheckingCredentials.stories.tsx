import { BrowserRouter } from "react-router-dom";
import { Meta, StoryFn } from "@storybook/react";

import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";

import { CheckingCredentials } from ".";

const meta: Meta<typeof CheckingCredentials> = {
  title: "login/outlets/checking-credentials",
  component: CheckingCredentials,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story: React.ElementType) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;

const mockBusinessUnits: IBusinessUnitsPortalStaff[] = [
  {
    businessUnitPublicCode: "100",
    abbreviatedName: "BU1",
    descriptionUse: "Business Unit 1",
    urlLogo: "https://example.com/logo1.png",
    firstMonthOfFiscalYear: "January",
    languageId: "en",
  },
  {
    businessUnitPublicCode: "BU002",
    abbreviatedName: "BU2",
    descriptionUse: "Business Unit 2",
    urlLogo: "https://example.com/logo2.png",
    firstMonthOfFiscalYear: "April",
    languageId: "es",
  },
];

export const Default: StoryFn<typeof CheckingCredentials> = () => (
  <CheckingCredentials businessUnits={mockBusinessUnits} />
);
