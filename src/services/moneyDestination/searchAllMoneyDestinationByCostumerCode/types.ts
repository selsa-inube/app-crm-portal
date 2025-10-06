export interface IMoneyDestination {
  abbreviatedName: string;
  descriptionUse: string;
  iconReference: string;
  linesOfCredit: {
    creditPlacementChannels: string[];
    lineOfCreditAbbreviatedName: string;
  }[];
  moneyDestinationId: string;
  moneyDestinationType: string;
}
