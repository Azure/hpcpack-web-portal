import { RestProperty } from '../services/api.service'

export class Job {
  //TODO: convert string to real type
  Id: string;
  Name: string;
  Owner: string;
  UserName: string;
  Project: string;
  RuntimeSeconds: string;
  SubmitTime: string;
  CreateTime: string;
  EndTime: string;
  StartTime: string;
  ChangeTime: string;
  State: string;
  PreviousState: string;
  MinCores: string;
  MaxCores: string;
  MinNodes: string;
  MaxNodes: string;
  MinSockets: string;
  MaxSockets: string;
  UnitType: string;
  RequestedNodes: string;
  IsExclusive: string;
  RunUntilCanceled: string;
  NodeGroups: string;
  FailOnTaskFailure: string;
  AutoCalculateMax: string;
  AutoCalculateMin: string;
  CanGrow: string;
  CanShrink: string;
  Preemptable: string;
  ErrorMessage: string;
  HasRuntime: string;
  RequeueCount: string;
  MinMemory: string;
  MaxMemory: string;
  MinCoresPerNode: string;
  MaxCoresPerNode: string;
  EndpointReference: string;
  SoftwareLicense: string;
  OrderBy: string;
  ClientSource: string;
  Progress: string;
  ProgressMessage: string;
  TargetResourceCount: string;
  ExpandedPriority: string;
  ServiceName: string;
  JobTemplate: string;
  HoldUntil: string;
  NotifyOnStart: string;
  NotifyOnCompletion: string;
  ExcludedNodes: string;
  EmailAddress: string;
  Pool: string;
  Priority: string;
  AllocatedNodes: string;
  JobValidExitCodes: string;
  ParentJobIds: string;
  FailDependentTasks: string;
  NodeGroupOp: string;
  SingleNode: string;
  ChildJobIds: string;
  EstimatedProcessMemory: string;
  PlannedCoreCount: string;
  TaskExecutionFailureRetryLimit: string;

  get Ended(): boolean {
    return ['Finished', 'Failed', 'Canceled'].includes(this.State);
  }

  update(other: Job): void {
    for (let key of Job.properties) {
      (this as any)[key] = (other as any)[key];
    }
  }

  static readonly properties = [
    "Id",
    "Name",
    "Owner",
    "UserName",
    "Project",
    "RuntimeSeconds",
    "SubmitTime",
    "CreateTime",
    "EndTime",
    "StartTime",
    "ChangeTime",
    "State",
    "PreviousState",
    "MinCores",
    "MaxCores",
    "MinNodes",
    "MaxNodes",
    "MinSockets",
    "MaxSockets",
    "UnitType",
    "RequestedNodes",
    "IsExclusive",
    "RunUntilCanceled",
    "NodeGroups",
    "FailOnTaskFailure",
    "AutoCalculateMax",
    "AutoCalculateMin",
    "CanGrow",
    "CanShrink",
    "Preemptable",
    "ErrorMessage",
    "HasRuntime",
    "RequeueCount",
    "MinMemory",
    "MaxMemory",
    "MinCoresPerNode",
    "MaxCoresPerNode",
    "EndpointReference",
    "SoftwareLicense",
    "OrderBy",
    "ClientSource",
    "Progress",
    "ProgressMessage",
    "TargetResourceCount",
    "ExpandedPriority",
    "ServiceName",
    "JobTemplate",
    "HoldUntil",
    "NotifyOnStart",
    "NotifyOnCompletion",
    "ExcludedNodes",
    "EmailAddress",
    "Pool",
    "Priority",
    "AllocatedNodes",
    "JobValidExitCodes",
    "ParentJobIds",
    "FailDependentTasks",
    "NodeGroupOp",
    "SingleNode",
    "ChildJobIds",
    "EstimatedProcessMemory",
    "PlannedCoreCount",
    "TaskExecutionFailureRetryLimit",
  ].sort();

  static fromProperties(properties: Array<RestProperty>): Job {
    let job = new Job();
    properties.forEach(prop => {
      (job as any)[prop.Name] = prop.Value;
    });
    return job;
  }
}

