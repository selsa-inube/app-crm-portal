import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@inubekit/button";
import { ScoreModal, ScoreModalProps } from "..";
import { scoreModalArgs } from "./props";

const meta: Meta<typeof ScoreModal> = {
  title: "components/modals/FrcModal",
  component: ScoreModal,
  argTypes: scoreModalArgs,
};

export default meta;

type Story = StoryObj<ScoreModalProps>;

export const Default: Story = (args: ScoreModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Open Score Modal</Button>
      {showModal && (
        <ScoreModal {...args} handleClose={() => setShowModal(false)} />
      )}
    </>
  );
};

Default.args = {
  title: "Endeudamiento máximo x FRC",
  totalScore: 150,
  seniority: 10,
  centralRisk: 150,
  employmentStability: 200,
  maritalStatus: 50,
  economicActivity: 150,
  monthlyIncome: 5000000,
  maxIndebtedness: 2000000,
};
