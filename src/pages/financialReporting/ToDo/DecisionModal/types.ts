interface IMakeDecisionsCreditRequestWithXAction {
  businessUnit: string;
  user: string;
  makeDecision: IMakeDecisionsCreditRequest;
  humanDecisionDescription: string;
  xAction: string;
}

interface IMakeDecisionsPayload {
  creditRequestId: string;
  humanDecision: string;
  justification: string;
  nonCompliantDocuments?: string[];
}

export type { IMakeDecisionsCreditRequestWithXAction, IMakeDecisionsPayload };
