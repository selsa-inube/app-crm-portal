import {
  EmployeeReference,
  ContractRemunerationAssignment,
  TraceabilityEmploymentContract,
  VacationHistory,
  Employee,
} from "@ptypes/employeePortalConsultation.types";

const toStringSafe = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return "";
};

const toNumberSafe = (value: unknown): number => {
  return typeof value === "number" ? value : 0;
};

const mapEmployeeReferenceApiToEntity = (
  reference: Record<string, unknown>,
): EmployeeReference => ({
  employeeId: toStringSafe(reference.employeeId),
  referenceAddress: toStringSafe(reference.referenceAddress),
  referenceId: toStringSafe(reference.referenceId),
  referenceName: toStringSafe(reference.referenceName),
  referencePhoneNumber: toStringSafe(reference.referencePhoneNumber),
  referenceType: toStringSafe(reference.referenceType),
  verificationDate: toStringSafe(reference.verificationDate),
  verificationObservation: toStringSafe(reference.verificationObservation),
});

const mapContractRemunerationAssignmentApiToEntity = (
  assignment: Record<string, unknown>,
): ContractRemunerationAssignment => ({
  assignmentId: toStringSafe(assignment.assignmentId),
  contractId: toStringSafe(assignment.contractId),
  currencyCodeForPayment: toStringSafe(assignment.currencyCodeForPayment),
  currencyCodeForValue: toStringSafe(assignment.currencyCodeForValue),
  currencyNameForPayment: toStringSafe(assignment.currencyNameForPayment),
  currencyNameForValue: toStringSafe(assignment.currencyNameForValue),
  descriptionForTheEmployee: toStringSafe(assignment.descriptionForTheEmployee),
  descriptionForTheStaff: toStringSafe(assignment.descriptionForTheStaff),
  individualValuePerEmployee: toStringSafe(assignment.individualValuePerEmployee),
  timeUnitOfValue: toNumberSafe(assignment.timeUnitOfValue),
  wageComponentCode: toStringSafe(assignment.wageComponentCode),
});

const mapTraceabilityEmploymentContractApiToEntity = (
  trace: Record<string, unknown>,
): TraceabilityEmploymentContract => ({
  addendumDate: toStringSafe(trace.addendumDate),
  contractId: toStringSafe(trace.contractId),
  modifiedContractProperty: toStringSafe(trace.modifiedContractProperty),
  previousValue: toStringSafe(trace.previousValue),
  traceContractId: toStringSafe(trace.traceContractId),
});

const mapVacationHistoryApiToEntity = (vacation: Record<string, unknown>): VacationHistory => ({
  businessDaysOfVacation: toNumberSafe(vacation.businessDaysOfVacation),
  contractId: toStringSafe(vacation.contractId),
  earlyReturnDate: toStringSafe(vacation.earlyReturnDate),
  employeeId: toStringSafe(vacation.employeeId),
  joiningLetter: toStringSafe(vacation.joiningLetter),
  nonWorkingDaysOfVacation: toNumberSafe(vacation.nonWorkingDaysOfVacation),
  startDateVacationEnjoyment: toStringSafe(vacation.startDateVacationEnjoyment),
  vacationDaysPendingEarlyReturn: toNumberSafe(vacation.vacationDaysPendingEarlyReturn),
  vacationId: toStringSafe(vacation.vacationId),
  vacationPaymentDate: toStringSafe(vacation.vacationPaymentDate),
  vacationStatus: toStringSafe(vacation.vacationStatus),
  vacationType: toStringSafe(vacation.vacationType),
});

const mapEmployeeApiToEntity = (employee: Record<string, unknown>): Employee => ({
  biologicalSex: toStringSafe(employee.biologicalSex),
  birthDay: toStringSafe(employee.birthDay),
  countryOfIdentityDocument: toStringSafe(employee.countryOfIdentityDocument),
  countryTaxResidence: toStringSafe(employee.countryTaxResidence),
  eMail: toStringSafe(employee.eMail),
  employeeCode: toStringSafe(employee.employeeCode),
  employeeId: toStringSafe(employee.employeeId),
  employeeReferences:
    (employee.employeeReferences as Record<string, unknown>[])?.map(
      mapEmployeeReferenceApiToEntity,
    ) || [],
  employeeStatus: toStringSafe(employee.employeeStatus),
  employmentContracts:
    (employee.employmentContracts as Record<string, unknown>[])?.map((contract) => ({
      branchOfficeName: toStringSafe(contract.branchOfficeName),
      businessName: toStringSafe(contract.businessName),
      contractDurationInDays: toNumberSafe(contract.contractDurationInDays),
      contractId: toStringSafe(contract.contractId),
      contractIdRenewed: toStringSafe(contract.contractIdRenewed),
      contractNumber: toStringSafe(contract.contractNumber),
      contractRemunerationAssignments:
        (contract.contractRemunerationAssignments as Record<string, unknown>[])?.map(
          mapContractRemunerationAssignmentApiToEntity,
        ) || [],
      contractStatus: toStringSafe(contract.contractStatus),
      contractType: toStringSafe(contract.contractType),
      costCenterName: toStringSafe(contract.costCenterName),
      deadline: toStringSafe(contract.deadline),
      employeeId: toStringSafe(contract.employeeId),
      formalizedStartDate: toStringSafe(contract.formalizedStartDate),
      jobModality: toStringSafe(contract.jobModality),
      joiningLetter: toStringSafe(contract.joiningLetter),
      professionalRiskLevelName: toStringSafe(contract.professionalRiskLevelName),
      proyectNumber: toStringSafe(contract.proyectNumber),
      regulatoryFrameworkName: toStringSafe(contract.regulatoryFrameworkName),
      remunerationProfileName: toStringSafe(contract.remunerationProfileName),
      startDate: toStringSafe(contract.startDate),
      traceabilityEmploymentContracts:
        (contract.traceabilityEmploymentContracts as Record<string, unknown>[])?.map(
          mapTraceabilityEmploymentContractApiToEntity,
        ) || [],
      vacationsHistory:
        (contract.vacationsHistory as Record<string, unknown>[])?.map(
          mapVacationHistoryApiToEntity,
        ) || [],
      workSchedule: toStringSafe(contract.workSchedule),
    })) || [],
  identificationDocumentNumber: toStringSafe(employee.identificationDocumentNumber),
  identificationType: toStringSafe(employee.identificationType),
  names: toStringSafe(employee.names),
  positionsByEmployeeAndCompany:
    (employee.positionsByEmployeeAndCompany as Record<string, unknown>[])?.map((position) => ({
      companyName: toStringSafe(position.companyName),
      employeeId: toStringSafe(position.employeeId),
      positionId: toStringSafe(position.positionId),
      positionName: toStringSafe(position.positionName),
    })) || [],
  postalCode: toStringSafe(employee.postalCode),
  residenceAddress: toStringSafe(employee.residenceAddress),
  residenceCity: toStringSafe(employee.residenceCity),
  surnames: toStringSafe(employee.surnames),
  telephone: toStringSafe(employee.telephone),
  traceabilityEmployeePositions:
    (employee.traceabilityEmployeePositions as Record<string, unknown>[])?.map((trace) => ({
      companyName: toStringSafe(trace.companyName),
      employeeId: toStringSafe(trace.employeeId),
      modificationDate: toStringSafe(trace.modificationDate),
      previousPosition: toStringSafe(trace.previousPosition),
      tracePositionId: toStringSafe(trace.tracePositionId),
    })) || [],
  ubication: toStringSafe(employee.ubication),
  userAccountId: toStringSafe(employee.userAccountId),
});

export { mapEmployeeApiToEntity };
