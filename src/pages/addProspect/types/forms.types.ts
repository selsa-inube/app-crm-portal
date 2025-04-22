interface IAssignmentFormEntry {
  id: string;
  value: string;
  isActive: boolean;
}

interface IFormsInvitation {
  generalInformation: { entries?: [] };
  branches: { entries: IAssignmentFormEntry[] };
  projects: { entries: IAssignmentFormEntry[] };
  events: { entries: IAssignmentFormEntry[] };
  aidBudgetUnits: { entries: IAssignmentFormEntry[] };
  payrolls: { entries: IAssignmentFormEntry[] };
}

interface LoanConditionState {
  toggles: {
    quotaCapToggle: boolean;
    maximumTermToggle: boolean;
  };
  quotaCapValue: string;
  maximumTermValue: string;
}

export type { IFormsInvitation, IAssignmentFormEntry, LoanConditionState };
