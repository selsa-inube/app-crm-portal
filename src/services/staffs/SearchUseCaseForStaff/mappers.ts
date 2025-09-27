import { ICreditSearchUseCase } from "./types";
export const mapCreditRequestToEntities = (
  creditRequest: ICreditSearchUseCase,
): string[] => {
  return creditRequest.listOfUseCases;
};
