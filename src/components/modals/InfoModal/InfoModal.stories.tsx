import { Meta, StoryObj } from "@storybook/react";

import { InfoModal, InfoItem } from "@components/modals/InfoModal";
import { MdClose, MdOutlineSend, MdOutlineRemoveRedEye } from "react-icons/md";

const meta: Meta<typeof InfoModal> = {
  title: "components/modals/InfoModal",
  component: InfoModal,
};

const Default: StoryObj<{ items: InfoItem[] }> = {
  render: (args) => <InfoModal {...args} />,
  args: {
    items: [
      {
        icon: <MdClose />,
        text: "No Cumple",
        appearance: "danger",
        shape: "circle",
      },
      { icon: <MdOutlineSend />, text: "Reenviar", appearance: "primary" },
      {
        icon: <MdOutlineRemoveRedEye />,
        text: "Ver Imagen",
        appearance: "primary",
      },
    ],
  },
};

export { Default };
export default meta;
