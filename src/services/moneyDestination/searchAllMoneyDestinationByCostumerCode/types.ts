export interface MoneyDestination {
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

export interface SearchAllMoneyDestinationByCostumerResponse {
  moneyDestinations: MoneyDestination[];
}
