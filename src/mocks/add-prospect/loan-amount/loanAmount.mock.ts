interface ILoanAmount {
  id: number;
  choice: string;
}

export const loanAmount: ILoanAmount[] = [
  { id: 101, choice: "expectToReceive" },
  { id: 102, choice: "amountRequested" },
];
