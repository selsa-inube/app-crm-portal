import {
  EStatus,
  ETaskStatus,
  EType,
  HumanResourceRequest,
  HumanResourceRequestTraceability,
  TaskToManageHumanResourceRequest,
} from "@ptypes/humanResourcesRequest.types";

const mapHumanResourceRequestApiToEntity = (
  item: Partial<HumanResourceRequest>,
): HumanResourceRequest => ({
  humanResourceRequestId: String(item.humanResourceRequestId ?? ""),
  humanResourceRequestNumber: String(item.humanResourceRequestNumber ?? ""),
  humanResourceRequestDescription: String(item.humanResourceRequestDescription ?? ""),
  humanResourceRequestDate: String(item.humanResourceRequestDate ?? ""),
  humanResourceRequestStatus: item.humanResourceRequestStatus as EStatus,
  humanResourceRequestData:
    item.humanResourceRequestData ?? ({} as HumanResourceRequest["humanResourceRequestData"]),
  humanResourceRequestType: item.humanResourceRequestType as EType,
  employeeId: String(item.employeeId ?? ""),
  userCodeInCharge: String(item.userCodeInCharge ?? ""),
  userNameInCharge: String(item.userNameInCharge ?? ""),
  humanResourceRequestTraceabilities: Array.isArray(item.humanResourceRequestTraceabilities)
    ? item.humanResourceRequestTraceabilities.map(mapHumanResourceRequestTraceabilityApiToEntity)
    : [],
  tasksToManageTheHumanResourcesRequests: Array.isArray(item.tasksToManageTheHumanResourcesRequests)
    ? item.tasksToManageTheHumanResourcesRequests.map(
        mapTaskManagingHumanResourceRequestApiToEntity,
      )
    : [],
});

const mapHumanResourceRequestTraceabilityApiToEntity = (
  item: Partial<HumanResourceRequestTraceability>,
): HumanResourceRequestTraceability => ({
  traceabilityId: String(item.traceabilityId ?? ""),
  humanResourceRequestId: String(item.humanResourceRequestId ?? ""),
  actionExecuted: String(item.actionExecuted ?? ""),
  userWhoExecutedAction: String(item.userWhoExecutedAction ?? ""),
  executionDate: String(item.executionDate ?? ""),
  description: String(item.description ?? ""),
});

const mapTaskManagingHumanResourceRequestApiToEntity = (
  item: Partial<TaskToManageHumanResourceRequest>,
): TaskToManageHumanResourceRequest => ({
  taskManagingId: String(item.taskManagingId ?? ""),
  humanResourceRequestId: String(item.humanResourceRequestId ?? ""),
  taskCode: String(item.taskCode ?? ""),
  taskName: String(item.taskName ?? ""),
  taskStatus: item.taskStatus as ETaskStatus,
  description: String(item.description ?? ""),
});

export {
  mapHumanResourceRequestApiToEntity,
  mapHumanResourceRequestTraceabilityApiToEntity,
  mapTaskManagingHumanResourceRequestApiToEntity,
};
