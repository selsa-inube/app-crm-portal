export interface HumanResourceRequestTraceability {
  actionExecuted: string;
  description: string;
  executionDate: string;
  humanResourceRequestId: string;
  traceabilityId: string;
  userWhoExecutedAction: string;
}

export interface TaskToManageHumanResourceRequest {
  description: string;
  humanResourceRequestId: string;
  taskCode: string;
  taskManagingId: string;
  taskName: string;
  taskStatus: ETaskStatus;
}

export interface HumanResourceRequest {
  employeeId: string;
  humanResourceRequestData: humanResourceRequestData;
  humanResourceRequestDate: string;
  humanResourceRequestDescription: string;
  humanResourceRequestId: string;
  humanResourceRequestNumber: string;
  humanResourceRequestStatus: EStatus;
  humanResourceRequestTraceabilities: HumanResourceRequestTraceability[];
  humanResourceRequestType: EType;
  tasksToManageTheHumanResourcesRequests: TaskToManageHumanResourceRequest[];
  userCodeInCharge: string;
  userNameInCharge: string;
}

export interface humanResourceRequestData {
  typeOfRequest: string;
  contract: string;
  addressee: string;
  startDate: string;
  daysEnjoyed: string;
  paidDays: string;
}

export enum EStatus {
  in_progress = "En progreso",
  finished = "Terminada",
  closed = "Cerrada",
  rejected = "Rechazada",
  cancele = "Cancelada",
}

export enum EType {
  onboarding = "Vinculación",
  vacations = "Vacaciones",
  certification = "Certificación",
  disability = "Incapacidad",
  leave = "Permiso",
  unpaid_Leave = "Licencia no remunerada",
  leaving_the_Job = "Retiro",
  salary_increase = "Ascenso salarial",
  position_transfer = "Traslado de cargo",
  Absence = "Ausencia",
  pqr = "PQR",
}

export enum ETaskStatus {
  Assigned = "Asignada",
  Executed = "Ejecutada",
}

export type HumanResourceRequests = HumanResourceRequest[];
