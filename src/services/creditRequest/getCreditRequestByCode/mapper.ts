import { DmEtapasPrs, ICreditRequest } from "../types";

export const mapCreditRequestToEntity = (
  data: Record<string, string | number | object>,
): ICreditRequest => {
  const creditRequest: ICreditRequest = {
    creditRequestId: data.creditRequestId as string,
    creditRequestCode: data.creditRequestCode as string,
    creditRequestStateAbbreviatedName:
      data.creditRequestStateAbbreviatedName as string,
    creditRequestDateOfCreation: data.creditRequestDateOfCreation as string,
    loanAmount: data.loanAmount as number,
    clientId: data.clientId as string,
    moneyDestinationId: data.moneyDestinationId as string,
    stage: data.stage as DmEtapasPrs,
    moneyDestinationAbreviatedName:
      data.moneyDestinationAbreviatedName as string,
    clientIdentificationNumber: data.clientIdentificationNumber as string,
    clientName: data.clientName as string,
    taskToBeDone: data.taskToBeDone as string,
    unreadNovelties: data.unreadNovelties as string,
  };
  return creditRequest;
};

export const mapCreditRequestToEntities = (
  creditRequest: Record<string, string | number | object>[],
): ICreditRequest[] => {
  return creditRequest.map(mapCreditRequestToEntity);
};
