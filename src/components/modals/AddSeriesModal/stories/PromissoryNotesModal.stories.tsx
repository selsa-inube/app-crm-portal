import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button } from "@inubekit/inubekit";

import {
  IExtraordinaryInstallment,
  IExtraordinaryInstallments,
} from "@services/prospect/types/extraordInaryInstallments";

import { AddSeriesModal, AddSeriesModalProps } from "../index";
import { props, parameters } from "./props";

const story: Meta<typeof AddSeriesModal> = {
  component: AddSeriesModal,
  title: "components/modals/AddSeriesModal",
  argTypes: props,
  parameters,
};

const DefaultTemplate: StoryFn<AddSeriesModalProps> = (args) => {
  const [showModal, setShowModal] = useState(false);
  const [seriesModal, setSeriesModal] = useState<IExtraordinaryInstallment[]>(
    [],
  );
  const [sentData, setSentData] = useState<IExtraordinaryInstallments | null>(
    null,
  );
  const [installmentState, setInstallmentState] = useState<{
    installmentAmount: number;
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
  }>({
    installmentAmount: 0,
    installmentDate: "",
    paymentChannelAbbreviatedName: "",
  });

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Button onClick={handleShowModal}>Open Modal</Button>
      {showModal && (
        <AddSeriesModal
          {...args}
          handleClose={handleShowModal}
          seriesModal={seriesModal}
          setSeriesModal={setSeriesModal}
          sentData={sentData}
          setSentData={setSentData}
          installmentState={installmentState}
          setInstallmentState={setInstallmentState}
        />
      )}
    </>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  onSubmit: (values) => {
    console.log("Submitted values:", values);
  },
};
export default story;
