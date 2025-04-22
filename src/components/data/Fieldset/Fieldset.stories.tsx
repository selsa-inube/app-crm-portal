import { Meta, StoryObj } from "@storybook/react";
import { Stack, Text, Button } from "@inubekit/inubekit";

import { Fieldset } from ".";

type Story = StoryObj<typeof Fieldset>;

const meta: Meta<typeof Fieldset> = {
  component: Fieldset,
  title: "components/data/Fieldset",
  argTypes: {
    title: {
      control: {
        type: "text",
      },
      description: "title of the component",
    },
    descriptionTitle: {
      control: {
        type: "text",
      },
      description: "description title of the component",
    },
    children: {
      description: "children of the component",
    },
    isMobile: {
      control: {
        type: "boolean",
      },
      description: "isMobile of the component",
    },
  },
};

const Example = () => (
  <Stack direction="column" gap="16px">
    <Text type="label" appearance="dark">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum culpa
      neque ab! Ab, quibusdam magnam! Quod enim dolor blanditiis quos voluptatum
      dolores, asperiores maxime. Beatae possimus quo voluptatem doloribus
      cumque!
    </Text>
    <Button>Click me</Button>
  </Stack>
);

const SelectedExample = () => (
  <Stack direction="column" gap="16px" padding="16px">
    <Stack justifyContent="space-between">
      <Text appearance="dark" type="label" weight="bold">
        Monto máx.
      </Text>
      <Text appearance="gray" size="medium">
        <Text as="span" appearance="primary" size="small" weight="bold">
          ${" "}
        </Text>
        20'000.000
      </Text>
    </Stack>
    <Stack justifyContent="space-between">
      <Text appearance="dark" type="label" weight="bold">
        Tasa máx.
      </Text>
      <Text appearance="gray" size="medium">
        1 % M.V
      </Text>
    </Stack>
    <Stack justifyContent="space-between">
      <Text appearance="dark" type="label" weight="bold">
        Plazo máx.
      </Text>
      <Text appearance="gray" size="medium">
        36 meses
      </Text>
    </Stack>
  </Stack>
);

export const Default: Story = {
  args: {
    title: "Por hacer",
    descriptionTitle: "Dorian Medina López",
    children: <Example />,
  },
};

export const Selected: Story = {
  args: {
    title: "Crédito vacacional",
    children: <SelectedExample />,
    isClickable: true,
  },
};

export default meta;
