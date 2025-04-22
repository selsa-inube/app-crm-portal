import { ILineCredit } from "@services/types";

export const lineOfCredit: ILineCredit[] = [
  {
    line_of_credit_id: crypto.randomUUID(),
    line_of_credit_code: "101",
    abbreviated_name: "Crédito vacacional",
    description_use: "Crédito vacacional",
    loan_amount_limit: 20000000,
    loan_term_limit: 36,
    interest_rate: 1,
  },
  {
    line_of_credit_id: crypto.randomUUID(),
    line_of_credit_code: "102",
    abbreviated_name: "Libre Inversion",
    description_use: "Libre Inversion",
    loan_amount_limit: 50000000,
    loan_term_limit: 60,
    interest_rate: 1.5,
  },
  {
    line_of_credit_id: crypto.randomUUID(),
    line_of_credit_code: "103",
    abbreviated_name: "Crediaportes",
    description_use: "Crediaportes",
    loan_amount_limit: 10000000,
    loan_term_limit: 30,
    interest_rate: 0.5,
  },
  {
    line_of_credit_id: crypto.randomUUID(),
    line_of_credit_code: "104",
    abbreviated_name: "Libre Inversion",
    description_use: "Libre Inversion",
    loan_amount_limit: 5000000,
    loan_term_limit: 12,
    interest_rate: 2.0,
  },
  {
    line_of_credit_id: crypto.randomUUID(),
    line_of_credit_code: "105",
    abbreviated_name: "Crediaportes",
    description_use: "Crediaportes",
    loan_amount_limit: 32000000,
    loan_term_limit: 48,
    interest_rate: 0.5,
  },
];
