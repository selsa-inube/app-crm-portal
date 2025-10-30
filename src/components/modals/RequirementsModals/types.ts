export interface IOptionsSelect {
  id: string;
  label: string;
  value: string;
}

export interface IApprovalSystem {
  observations: string;
  toggleChecked: boolean;
  labelText: string;
}

export interface IApprovalDocumentaries {
  answer: string;
  observations: string;
  check?: boolean;
  selectedDocumentIds?: Record<string, boolean>;
  selectedDocuments?: DocumentItem[];
}

export interface DocumentItem {
  creditRequestId: string;
  documentId: string;
  documentManagmentReference: string;
  abbreviatedName: string;
  fileName: string;
}

export interface IApprovalHuman {
  answer: string;
  observations: string;
}
