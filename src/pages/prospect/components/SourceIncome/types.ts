interface IDebtor {
  id: string;
  label: string;
  value: string;
}

export interface IIncome {
  borrowers?: IDebtor[];
  borrower_id: string;
  borrower: string;
  capital: string[];
  employment: string[];
  businesses: string[];
}
