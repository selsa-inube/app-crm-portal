import { IBorrowerProperty } from "../IBorrowerProperty";
interface IBorrower {
  borrower_identification_number: string;
  borrower_identification_type: string;
  borrower_name: string;
  borrower_properties: IBorrowerProperty[];
  borrower_type: string;
}

export type { IBorrower };
