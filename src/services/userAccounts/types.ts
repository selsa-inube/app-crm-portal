export interface IPostUserAccountsRequestBody {
  authorizationValue: string;
}

export interface IPostUserAccountsResponse {
  accessToken: string;
  idToken: string;
}

export interface IPostUserAccountsResponseWithTokens {
  success: boolean;
  data?: IPostUserAccountsResponse;
  message?: string;
}
