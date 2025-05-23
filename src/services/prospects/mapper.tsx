import {
  IProspect,
  IBorrower,
  IConsolidatedCredit,
  ICreditProduct,
  IOutlay,
} from "./types";

const mapProspectEntity = (
  data: Record<string, string | number | object>,
): IProspect => {
  const buildResend: IProspect = {
    prospectId: data.prospect_id as string,
    prospect_code: data.prospect_code as string,
    state: data.state as string,
    requested_amount: data.requested_amount as number,
    installment_limit: data.installment_limit as number,
    term_limit: data.term_limit as number,
    time_of_creation: data.time_of_creation as Date,
    selected_regular_payment_schedule:
      data.selected_regular_payment_schedule as string,
    selected_rate_type: data.selected_rate_type as string,
    preferred_payment_channel_abbreviated_name:
      data.preferred_payment_channel_abbreviated_name as string,
    grace_period: data.grace_period as number,
    grace_period_type: data.grace_period_type as string,
    money_destination_abbreviated_name:
      data.money_destination_abbreviated_name as string,
    bond_value: data.bond_value as number,
    borrowers: data.borrowers as IBorrower[],
    consolidated_credits: data.consolidated_credits as IConsolidatedCredit[],
    credit_products: data.credit_products as ICreditProduct[],
    outlays: data.outlays as IOutlay[],
  };
  return buildResend;
};

export { mapProspectEntity };
