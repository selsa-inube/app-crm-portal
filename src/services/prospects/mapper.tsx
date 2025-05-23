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
    prospectId: data.prospectId as string,
    prospectCode: data.prospectCode as string,
    state: data.state as string,
    requestedAmount: data.requestedAmount as number,
    installmentLimit: data.installmentLimit as number,
    termLimit: data.termLimit as number,
    timeOfCreation: data.timeOfCreation as Date,
    selectedRegularPaymentSchedule:
      data.selectedRegularPaymentSchedule as string,
    selectedRateType: data.selectedRateType as string,
    preferredPaymentChannelAbbreviatedName:
      data.preferredPaymentChannelAbbreviatedName as string,
    gracePeriod: data.gracePeriod as number,
    gracePeriodType: data.gracePeriodType as string,
    moneyDestinationAbbreviatedName:
      data.moneyDestinationAbbreviatedName as string,
    bondValue: data.bondValue as number,
    borrowers: data.borrowers as IBorrower[],
    consolidatedCredits: data.consolidatedCredits as IConsolidatedCredit[],
    creditProducts: data.creditProducts as ICreditProduct[],
    outlays: data.outlays as IOutlay[],
  };
  return buildResend;
};

export { mapProspectEntity };
