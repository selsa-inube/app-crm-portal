export interface IShareCreditProspect {
  clientName: string;
  email: string;
  prospectId: string;
  optionalEmail: string;
  file: File | null;
}
export interface IShareCreditProspectResponse {
  codeNotification: string;
}
