export interface IPortfolioObligation {
  obligationId: string;
  productName: string;
  status: string;
  balance: number;
}

export interface ICreditRiskBureauQuery {
  creditRiskBureauQueryId: string;
  clientName: string;
  clientIdentificationType: string;
  clientIdentificationNumber: string;
  queryDate: string;
  bureauName: string;
  creditRiskScore: number;
  registrantIdentificationNumber: string;
  isActive: string;
  portfolioObligations: IPortfolioObligation[];
}
