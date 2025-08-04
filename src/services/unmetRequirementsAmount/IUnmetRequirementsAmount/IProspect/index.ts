import { IBorrower } from "./IBorrower";
import { IConsolidatedCredit } from "./IConsolidatedCredit";
import { ICreditProduct } from "../ICreditProduct";
import { IOutlay } from "./IOutlay";

interface IProspect {
  bond_value: number;
  borrowers: IBorrower[];
  consolidated_credits: IConsolidatedCredit[];
  credit_products: ICreditProduct[];
  grace_period: number;
  grace_period_type: string;
  installment_limit: number;
  money_destination_abbreviated_name: string;
  outlays: IOutlay[];
  preferred_payment_channel_abbreviated_name: string;
  prospect_code: string;
  prospect_id: string;
  requested_amount: number;
  selected_rate_type: string;
  selected_regular_payment_schedule: string;
  state: string;
  term_limit: number;
  time_of_creation: string;
}

export type { IProspect };
