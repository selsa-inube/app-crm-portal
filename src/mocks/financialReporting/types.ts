type ItemValidation = {
  [key: string]: "Y" | "N" | "";
};

export interface CreditRequest {
  credit_request_id: string;
  system_validations: ItemValidation;
  documentary_requirements: ItemValidation;
  human_validations: ItemValidation;
}
