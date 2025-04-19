export enum RequestStatus {
  IN_PROGRESS = "in_progress",
  FINISHED = "finished",
  CLOSED = "closed",
  REJECTED = "rejected",
  CANCELED = "cancele",
}

export const RequestStatusLabel: Record<RequestStatus, string> = {
  [RequestStatus.IN_PROGRESS]: "En progreso",
  [RequestStatus.FINISHED]: "Terminada",
  [RequestStatus.CLOSED]: "Cerrada",
  [RequestStatus.REJECTED]: "Rechazada",
  [RequestStatus.CANCELED]: "Cancelada",
};

export enum HumanResourceRequestType {
  onboarding = "Vinculación",
  vacations = "Vacaciones",
  certification = "Certificacion",
  disability = "Incapacidad",
  leave = "Permiso",
  unpaid_Leave = "Licencia no remunerada",
  leaving_the_Job = "Retiro",
  salary_increase = "Ascenso salarial",
  position_transfer = "Traslado de cargo",
  Absence = "Ausencia",
  pqr = "PQR",
}

export interface IHumanResourceRequestData {
  daysOff: string;
  startDate: string;
  contract: string;
}

export interface IRequestBody {
  employeeId: string;
  humanResourceRequestData: string;
  humanResourceRequestDate: string;
  humanResourceRequestDescription: string;
  humanResourceRequestStatus: string;
  humanResourceRequestType: string;
  userCodeInCharge: string;
  userNameInCharge: string;
}

export interface IHumanResourceResponse {
  employeeId: string;
  humanResourceRequestData: string;
  humanResourceRequestDate: string;
  humanResourceRequestDescription: string;
  humanResourceRequestId: string;
  humanResourceRequestNumber: string;
  humanResourceRequestStatus: string;
  humanResourceRequestTraceabilities: {
    actionExecuted: string;
    description: string;
    executionDate: string;
    humanResourceRequestId: string;
    traceabilityId: string;
    transactionOperation: string;
    userWhoExecutedAction: string;
  }[];
  humanResourceRequestType: string;
  tasksToManageTheHumanResourcesRequests: {
    description: string;
    humanResourceRequestId: string;
    taskCode: string;
    taskManagingId: string;
    taskName: string;
    taskStatus: string;
    transactionOperation: string;
  }[];
  userCodeInCharge: string;
  userNameInCharge: string;
}
