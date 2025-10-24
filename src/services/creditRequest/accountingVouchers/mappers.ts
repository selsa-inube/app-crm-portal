import { IAccountingVouchers } from "../types";

const mapAccountingVouchersEntity = (
  data: Record<string, string | number | object>,
): IAccountingVouchers => {
  const creditRequest: IAccountingVouchers = {
    id: String(data.creditRequestId),
    creditRequestId: String(data.creditRequestId),
    documentCode: String(data.documentCode),
    obligationCode: String(data.obligationCode),
  };
  return creditRequest;
};

const mapAccountingVouchersEntities = (
  creditRequest: Record<string, string | number | object>[],
): IAccountingVouchers[] => {
  return creditRequest.map(mapAccountingVouchersEntity);
};

export { mapAccountingVouchersEntity, mapAccountingVouchersEntities };
