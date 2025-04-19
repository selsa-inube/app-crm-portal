export interface EmployeeReference {
  employeeId: string;
  referenceAddress: string;
  referenceId: string;
  referenceName: string;
  referencePhoneNumber: string;
  referenceType: string;
  verificationDate: string;
  verificationObservation: string;
}

export interface ContractRemunerationAssignment {
  assignmentId: string;
  contractId: string;
  currencyCodeForPayment: string;
  currencyCodeForValue: string;
  currencyNameForPayment: string;
  currencyNameForValue: string;
  descriptionForTheEmployee: string;
  descriptionForTheStaff: string;
  individualValuePerEmployee: string;
  timeUnitOfValue: number;
  wageComponentCode: string;
}

export interface TraceabilityEmploymentContract {
  addendumDate: string;
  contractId: string;
  modifiedContractProperty: string;
  previousValue: string;
  traceContractId: string;
}

export interface VacationHistory {
  businessDaysOfVacation: number;
  contractId: string;
  earlyReturnDate: string;
  employeeId: string;
  joiningLetter: string;
  nonWorkingDaysOfVacation: number;
  startDateVacationEnjoyment: string;
  vacationDaysPendingEarlyReturn: number;
  vacationId: string;
  vacationPaymentDate: string;
  vacationStatus: string;
  vacationType: string;
}

export interface EmploymentContract {
  branchOfficeName: string;
  businessName: string;
  contractDurationInDays: number;
  contractId: string;
  contractIdRenewed: string;
  contractNumber: string;
  contractRemunerationAssignments: ContractRemunerationAssignment[];
  contractStatus: string;
  contractType: string;
  costCenterName: string;
  deadline: string;
  employeeId: string;
  formalizedStartDate: string;
  jobModality: string;
  joiningLetter: string;
  professionalRiskLevelName: string;
  proyectNumber: string;
  regulatoryFrameworkName: string;
  remunerationProfileName: string;
  startDate: string;
  traceabilityEmploymentContracts: TraceabilityEmploymentContract[];
  vacationsHistory: VacationHistory[];
  workSchedule: string;
}

export interface PositionByEmployeeAndCompany {
  companyName: string;
  employeeId: string;
  positionId: string;
  positionName: string;
}

export interface TraceabilityEmployeePosition {
  companyName: string;
  employeeId: string;
  modificationDate: string;
  previousPosition: string;
  tracePositionId: string;
}

export interface Employee {
  biologicalSex: string;
  birthDay: string;
  countryOfIdentityDocument: string;
  countryTaxResidence: string;
  eMail: string;
  employeeCode: string;
  employeeId: string;
  employeeReferences: EmployeeReference[];
  employeeStatus: string;
  employmentContracts: EmploymentContract[];
  identificationDocumentNumber: string;
  identificationType: string;
  names: string;
  positionsByEmployeeAndCompany: PositionByEmployeeAndCompany[];
  postalCode: string;
  residenceAddress: string;
  residenceCity: string;
  surnames: string;
  telephone: string;
  traceabilityEmployeePositions: TraceabilityEmployeePosition[];
  ubication: string;
  userAccountId: string;
}
