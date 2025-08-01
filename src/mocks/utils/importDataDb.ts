import { ICreditRequest } from "@services/creditRequest/types";
import { mockRequests as mockRequestsDefault } from "@mocks/requests/requests.mock";
import { mockRequests as mockRequestsPresente } from "@mocks/requests/Presente/requests.mock";
import { mockRequests as mockRequestsCooservunal } from "@mocks/requests/Cooservunal/requests.mock";
import { mockRequests as mockRequestsCorbanca } from "@mocks/requests/Corbanca/requests.mock";
import { mockRequests as mockRequestsFondecom } from "@mocks/requests/Fondecom/requests.mock";

import { mockAnalyst as mockAnalystDefault } from "@mocks/staff/staff.mock";
import { mockAnalyst as mockAnalystPresente } from "@mocks/staff/Presente/staff.mock";
import { mockAnalyst as mockAnalystCooservunal } from "@mocks/staff/Cooservunal/staff.mock";
import { mockAnalyst as mockAnalystCorbanca } from "@mocks/staff/Corbanca/staff.mock";
import { mockAnalyst as mockAnalystFondecom } from "@mocks/staff/Fondecom/staff.mock";

import { mockAccountManager as mockAccountManagerDefault } from "@mocks/staff/staff.mock";
import { mockAccountManager as mockAccountManagerPresente } from "@mocks/staff/Presente/staff.mock";
import { mockAccountManager as mockAccountManagerCooservunal } from "@mocks/staff/Cooservunal/staff.mock";
import { mockAccountManager as mockAccountManagerCorbanca } from "@mocks/staff/Corbanca/staff.mock";
import { mockAccountManager as mockAccountManagerFondecom } from "@mocks/staff/Fondecom/staff.mock";

import { approval_by_credit_request_Mock as approval_by_credit_request_MockDefault } from "@mocks/financialReporting/Approvals.mock";
import { approval_by_credit_request_Mock as approval_by_credit_request_MockPresente } from "@mocks/financialReporting/Presente/Approvals.mock";
import { approval_by_credit_request_Mock as approval_by_credit_request_MockCooservunal } from "@mocks/financialReporting/Cooservunal/Approvals.mock";
import { approval_by_credit_request_Mock as approval_by_credit_request_MockCorbanca } from "@mocks/financialReporting/Corbanca/Approvals.mock";
import { approval_by_credit_request_Mock as approval_by_credit_request_MockFondecom } from "@mocks/financialReporting/Fondecom/Approvals.mock";

import { documents as documentsDefault } from "@mocks/financialReporting/documents.mock";
import { documents as documentsPresente } from "@mocks/financialReporting/Presente/documents.mock";
import { documents as documentsCooservunal } from "@mocks/financialReporting/Cooservunal/documents.mock";
import { documents as documentsCorbanca } from "@mocks/financialReporting/Corbanca/documents.mock";
import { documents as documentsFondecom } from "@mocks/financialReporting/Fondecom/documents.mock";

import { error_issued as error_issuedDefault } from "@mocks/financialReporting/error.mock";
import { error_issued as error_issuedPresente } from "@mocks/financialReporting/Presente/error.mock";
import { error_issued as error_issuedCooservunal } from "@mocks/financialReporting/Cooservunal/error.mock";
import { error_issued as error_issuedCorbanca } from "@mocks/financialReporting/Corbanca/error.mock";
import { error_issued as error_issuedFondecom } from "@mocks/financialReporting/Fondecom/error.mock";

import { traceMock as traceMockDefault } from "@mocks/financialReporting/trace.mock";
import { traceMock as traceMockPresente } from "@mocks/financialReporting/Presente/trace.mock";
import { traceMock as traceMockCooservunal } from "@mocks/financialReporting/Cooservunal/trace.mock";
import { traceMock as traceMockCorbanca } from "@mocks/financialReporting/Corbanca/trace.mock";
import { traceMock as traceMockFondecom } from "@mocks/financialReporting/Fondecom/trace.mock";

import { requirementsMock as requirementsMockPresente } from "@mocks/financialReporting/Presente/requirements.mock";
import { requirementsMock as requirementsMockCooservunal } from "@mocks/financialReporting/Cooservunal/requirements.mock";
import { requirementsMock as requirementsMockCorbanca } from "@mocks/financialReporting/Corbanca/requirements.mock";
import { requirementsMock as requirementsMockFondecom } from "@mocks/financialReporting/Presente/requirements.mock";

const mockRequestsMap: { [key: string]: ICreditRequest[] } = {
  Presente: mockRequestsPresente,
  Cooservunal: mockRequestsCooservunal,
  Corbanca: mockRequestsCorbanca,
  Fondecom: mockRequestsFondecom,
  default: mockRequestsDefault,
};

export const mockRequests = (company: string): ICreditRequest[] =>
  mockRequestsMap[company] || mockRequestsMap.default;

const mockAnalystMap: { [key: string]: typeof mockAnalystDefault } = {
  Presente: mockAnalystPresente,
  Cooservunal: mockAnalystCooservunal,
  Corbanca: mockAnalystCorbanca,
  Fondecom: mockAnalystFondecom,
  default: mockAnalystDefault,
};

export const mockAnalyst = (company: string) =>
  mockAnalystMap[company] || mockAnalystMap.default;

const mockAccountManagerMap: { [key: string]: typeof mockAnalystDefault } = {
  Presente: mockAccountManagerPresente,
  Cooservunal: mockAccountManagerCooservunal,
  Corbanca: mockAccountManagerCorbanca,
  Fondecom: mockAccountManagerFondecom,
  default: mockAccountManagerDefault,
};

export const mockAccountManager = (company: string) =>
  mockAccountManagerMap[company] || mockAccountManagerMap.default;

const approvalByCreditRequestMockMap: {
  [key: string]: typeof approval_by_credit_request_MockDefault;
} = {
  Presente: approval_by_credit_request_MockPresente,
  Cooservunal: approval_by_credit_request_MockCooservunal,
  Corbanca: approval_by_credit_request_MockCorbanca,
  Fondecom: approval_by_credit_request_MockFondecom,
  default: approval_by_credit_request_MockDefault,
};

export const approvalByCreditRequestMock = (company: string) =>
  approvalByCreditRequestMockMap[company] ||
  approvalByCreditRequestMockMap.default;

const documentsMap: { [key: string]: typeof documentsDefault } = {
  Presente: documentsPresente,
  Cooservunal: documentsCooservunal,
  Corbanca: documentsCorbanca,
  Fondecom: documentsFondecom,
  default: documentsDefault,
};

export const documents = (company: string) =>
  documentsMap[company] || documentsMap.default;

const errorIssuedMap: { [key: string]: typeof error_issuedDefault } = {
  Presente: error_issuedPresente,
  Cooservunal: error_issuedCooservunal,
  Corbanca: error_issuedCorbanca,
  Fondecom: error_issuedFondecom,
  default: error_issuedDefault,
};

export const errorIssued = (company: string) =>
  errorIssuedMap[company] || errorIssuedMap.default;

const traceMocks: { [key: string]: typeof traceMockDefault } = {
  Presente: traceMockPresente,
  Cooservunal: traceMockCooservunal,
  Corbanca: traceMockCorbanca,
  Fondecom: traceMockFondecom,
  default: traceMockDefault,
};

export const traceMock = (company: string) =>
  traceMocks[company] || traceMocks.default;

const businessUnit = {
  Presente: requirementsMockPresente,
  Cooservunal: requirementsMockCooservunal,
  Corbanca: requirementsMockCorbanca,
  Fondecom: requirementsMockFondecom,
};
export const requirementsMock = (company: string) =>
  businessUnit[company as keyof typeof businessUnit];
