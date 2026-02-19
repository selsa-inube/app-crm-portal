export interface IPortfolioObligation {
  obligationId: string;
  productName: string;
  status: string;
  balance: number;
}

export interface ICreditRiskBureauQuery {
  clientName: string;
  clientIdentificationType: string;
  clientIdentificationNumber: string;
  queryDate: string;
  bureauName: string;
  creditRiskScore: number;
  registrantIdentificationNumber: string;
  isActive: string;
  portfolioObligations: IPortfolioObligation[];
  creditRiskBureauQueryId?: string;
}

export interface IUpdateCreditRiskBureauQuery {
  clientIdentificationNumber: string;
  bureauName: string;
  creditRiskScore: number;
  queryDate: string;
  registrantIdentificationNumber: string;
  clientIdentificationType: string;
  clientName: string;
}

export enum EUpdateMethod {
  Manual = "Manual",
  Automatic = "Automatic",
}

export interface ICreditRiskBureauUpdateMethod {
  bureauName: string;
  updateCreditScoreMethod: EUpdateMethod;
}

export interface IGetUpdateMethodResponse {
  creditRiskBureaus: ICreditRiskBureauUpdateMethod[];
}
