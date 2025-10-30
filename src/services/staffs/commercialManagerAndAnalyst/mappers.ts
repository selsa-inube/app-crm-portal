import { ICommercialManagerAndAnalyst } from "../types";

const mapCommercialManagerAndAnalystEntity = (
  data: Record<string, string | number | object>,
): ICommercialManagerAndAnalyst => {
  const creditRequest: ICommercialManagerAndAnalyst = {
    identificationDocumentNumber: String(
      data.identificationDocumentNumber || "",
    ),
    staffId: String(data.staffId || ""),
    staffName: String(data.staffName || ""),
    userAccount: String(data.userAccount || ""),
  };
  return creditRequest;
};

const mapCommercialManagerAndAnalystEntities = (
  creditRequest: Record<string, string | number | object>[],
): ICommercialManagerAndAnalyst[] => {
  return creditRequest.map(mapCommercialManagerAndAnalystEntity);
};

export {
  mapCommercialManagerAndAnalystEntity,
  mapCommercialManagerAndAnalystEntities,
};
