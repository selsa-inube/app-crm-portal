import { IMoneyDestination } from "../types";

const mapMoneyDestinationToEntity = (
  data: Record<string, string | number | object>,
): IMoneyDestination => {
  const buildResend: IMoneyDestination = {
    abbreviatedName: data.abbreviatedName as string,
    descriptionUse: data.descriptionUse as string,
    iconReference: data.iconReference as string,
    moneyDestinationId: data.moneyDestinationId as string,
    moneyDestinationType: data.moneyDestinationType as string,
  };
  return buildResend;
};

export { mapMoneyDestinationToEntity };
