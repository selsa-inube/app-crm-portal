import { IModeOfDisbursement } from "../types";

export const mapModeOfDisbursementToEntity = (
  data: Record<string, string | number | object>,
): IModeOfDisbursement => {
  const modeOfDisbursement: IModeOfDisbursement = {
    accountBankCode: data.accountBankCode as string,
    accountBankName: data.accountBankName as string,
    accountNumber: data.accountNumber as string,
    accountType: data.accountType as string,
    creditRequestId: data.creditRequestId as string,
    disbursementAmount: data.disbursementAmount as number,
    disbursementDate: data.disbursementDate as string,
    disbursementReference: data.disbursementReference as string,
    isInTheNameOfBorrower: data.isInTheNameOfBorrower as string,
    modeOfDisbursementCode: data.modeOfDisbursementCode as string,
    modeOfDisbursementId: data.modeOfDisbursementId as string,
    modeOfDisbursementType: data.modeOfDisbursementType as string,
    observation: data.observation as string,
    payeeBiologicalSex: data.payeeBiologicalSex as string,
    payeeBirthday: data.payeeBirthday as string,
    payeeCityOfResidence: data.payeeCityOfResidence as string,
    payeeEmail: data.payeeEmail as string,
    payeeIdentificationNumber: data.payeeIdentificationNumber as string,
    payeeIdentificationType: data.payeeIdentificationType as string,
    payeeName: data.payeeName as string,
    payeePersonType: data.payeePersonType as string,
    payeePhoneNumber: data.payeePhoneNumber as string,
    payeeSurname: data.payeeSurname as string,
    paymentOrderReference: data.paymentOrderReference as string,
  };
  return modeOfDisbursement;
};

export const mapCreditRequestToEntities = (
  modeOfDisbursement: Record<string, string | number | object>[],
): IModeOfDisbursement[] => {
  return modeOfDisbursement.map(mapModeOfDisbursementToEntity);
};
