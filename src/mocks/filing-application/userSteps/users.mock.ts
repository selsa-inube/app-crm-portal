import { IUserSteps } from "@services/types";

export const userStepsMock: IUserSteps[] = [
  { id: 101, intermediateSteps: [3, 4, 5, 6] },
  { id: 102, intermediateSteps: [3] },
  { id: 103, intermediateSteps: [4] },
  { id: 104, intermediateSteps: [5] },
  { id: 105, intermediateSteps: [6] },
  { id: 106, intermediateSteps: [3, 6] },
  { id: 107, intermediateSteps: [3] },
  { id: 108, intermediateSteps: [3] },
  { id: 109, intermediateSteps: [3] },
];
