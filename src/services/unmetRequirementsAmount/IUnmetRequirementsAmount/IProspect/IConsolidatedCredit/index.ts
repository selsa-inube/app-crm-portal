interface IConsolidatedCredit {
  borrower_identification_number: string;
  borrower_identification_type: string;
  consolidated_amount: number;
  consolidated_amount_type: string;
  credit_product_code: string;
  estimated_date_of_consolidation: string;
  line_of_credit_description: string;
}

export type { IConsolidatedCredit };
