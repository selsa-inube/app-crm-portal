import { ArgTypes } from "@storybook/react";
import { ScoreModalProps } from "..";

export const scoreModalArgs: Partial<ArgTypes<ScoreModalProps>> = {
  handleClose: { action: "closed" },
};
