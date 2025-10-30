export interface IErrorsUnread {
  errorIssuedId: string;
  errorDescription: string;
}

export interface IErrorService {
  id: string;
  message: string | Error;
}

export interface IErrorService {
  id: string;
  message: string | Error;
}

export interface IDocumentData {
  documentId: string;
  fileName: string;
}
