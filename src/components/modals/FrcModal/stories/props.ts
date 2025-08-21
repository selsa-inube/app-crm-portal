import { ArgTypes } from "@storybook/react";
import { ScoreModalProps } from "..";

export const scoreModalArgs: Partial<ArgTypes<ScoreModalProps>> = {
  totalScore: {
    control: { type: "number" },
    description: "Total score displayed in the modal",
  },
  seniority: {
    control: { type: "number" },
    description: "Years of seniority",
  },
  centralRisk: {
    control: { type: "number" },
    description: "Risk score from the central risk agency",
  },
  employmentStability: {
    control: { type: "number" },
    description: "Labor stability index",
  },
  maritalStatus: {
    control: { type: "number" },
    description: "Marital status",
  },
  economicActivity: {
    control: { type: "number" },
    description: "Economic activity score",
  },
  monthlyIncome: {
    control: { type: "number" },
    description: "Monthly income",
  },
  maxIndebtedness: {
    control: { type: "text" },
    description: "Maximum indebtedness amount",
  },
};
