export interface IBorrowerProperty {
  property_name: string;
  property_value: string;
}

export interface IBorrower {
  borrower_name: string;
  borrower_type: string;
  borrower_identification_type: string;
  borrower_identification_number: string;
  borrower_properties: IBorrowerProperty[];
}

export interface IConsolidatedCredit {
  credit_product_code: string;
  consolidated_amount: number;
  consolidated_amount_type: string;
  estimated_date_of_consolidation: Date;
  line_of_credit_description: string;
  borrower_identification_type: string;
  borrower_identification_number: string;
}

export interface IOrdinaryInstallmentsForPrincipal {
  number_of_installments: number;
  schedule: string;
  installment_amount_for_capital: number;
  installment_amount: number;
  gradient_rate: number;
  gradient_value: number;
  gradient_schedule: string;
  first_gradient_date: Date;
  payment_channel_abbreviated: string;
}

export interface IInstallmentsForInterest {
  schedule: string;
  payment_channel_abbreviated_name: string;
}

export interface IExtraordinaryInstallment {
  installment_date: Date;
  installment_amount: number;
  payment_channel_abbreviated_name: string;
}

export interface IAcquiredCashFlow {
  amount: string;
  date: Date;
  payment_channel_abbreviated_name: string;
  flow_number: number;
}

export interface ICreditProduct {
  credit_product_code: string;
  loan_amount: number;
  line_of_credit_abbreviated_name: string;
  interest_rate: number;
  fixed_points: number;
  loan_term: number;
  schedule: string;
  ordinary_installments_for_principal: IOrdinaryInstallmentsForPrincipal[];
  installments_for_interest: IInstallmentsForInterest[];
  extraordinary_installments: IExtraordinaryInstallment[];
  acquired_cash_flows: IAcquiredCashFlow[];
}

export interface IOutlay {
  date: Date;
  amount: number;
}

export interface IProspect {
  prospect_id: string;
  prospect_code: string;
  state: string;
  requested_amount: number;
  installment_limit: number;
  term_limit: number;
  time_of_creation: Date;
  selected_regular_payment_schedule: string;
  selected_rate_type: string;
  preferred_payment_channel_abbreviated_name: string;
  grace_period: number;
  grace_period_type: string;
  money_destination_abbreviated_name: string;
  bond_value: number;
  borrowers: IBorrower[];
  consolidated_credits: IConsolidatedCredit[];
  credit_products: ICreditProduct[];
  outlays: IOutlay[];
}
