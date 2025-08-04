import { IAcquiredCashFlow } from "./IAcquiredCashFlow";
import { IExtraordinaryInstallment } from "./IExtraordinaryInstallment";
import { IInstallmentForInterest } from "./IInstallmentForInterest";
import { IOrdinaryInstallmentForPrincipal } from "./IOrdinaryInstallmentForPrincipal";

interface ICreditProduct {
  acquired_cash_flows: IAcquiredCashFlow[];
  credit_product_code: string;
  extraordinary_installments: IExtraordinaryInstallment[];
  fixed_points: number;
  installments_for_interest: IInstallmentForInterest[];
  interest_rate: number;
  line_of_credit_abbreviated_name: string;
  loan_amount: number;
  loan_term: number;
  ordinary_installments_for_principal: IOrdinaryInstallmentForPrincipal[];
  schedule: string;
}

export type { ICreditProduct };
