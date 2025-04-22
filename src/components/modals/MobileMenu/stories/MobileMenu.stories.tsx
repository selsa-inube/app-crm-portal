import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@inubekit/inubekit";

import { defaultMobileMenuProps } from "./props";
import { MobileMenu, MobileMenuProps } from "..";

const meta: Meta<typeof MobileMenu> = {
  title: "Components/modals/MobileMenu",
  component: MobileMenu,
  argTypes: {
    onClose: { action: "Cerrar menú" },
    onReject: { action: "Rechazar" },
    onCancel: { action: "Anular" },
    onAttach: { action: "Adjuntar" },
    onViewAttachments: { action: "Ver Adjuntos" },
  },
};

type Story = StoryObj<typeof MobileMenu>;

export const Default: Story = (args: MobileMenuProps) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <Button onClick={() => setShowMenu(true)}>Open Menu</Button>
      {showMenu && <MobileMenu {...args} onClose={() => setShowMenu(false)} />}
    </>
  );
};

Default.args = defaultMobileMenuProps;

export default meta;
