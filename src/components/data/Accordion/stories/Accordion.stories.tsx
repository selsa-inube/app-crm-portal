import { StoryFn } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import { Grid } from "@inubekit/inubekit";

import { BoxAttribute } from "@components/cards/BoxAttribute";

import { Accordion, AccordionProps } from "..";

const story = {
  component: [Accordion],
  title: "components/data/Accordion",
  decorators: [
    (Story: StoryFn) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

const Template: StoryFn<AccordionProps> = (args) => <Accordion {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Accordion",
  children: (
    <Grid templateColumns="1fr" width="100%">
      <BoxAttribute label="Label" value="Value" />
      <BoxAttribute label="Label" value="Value" />
      <BoxAttribute label="Label" value="Value" />
      <BoxAttribute label="Label" value="Value" />
    </Grid>
  ),
};

export default story;
