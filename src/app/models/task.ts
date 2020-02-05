import { RestProperty } from '../services/api.service'

export class Task {
  //TODO: convert string to real type
  Name: string;
  State: string;
  PreviousState: string;
  MinCores: string;
  MaxCores: string;
  MinNodes: string;
  MaxNodes: string;
  MinSockets: string;
  MaxSockets: string;
  RuntimeSeconds: string;
  SubmitTime: string;
  CreateTime: string;
  EndTime: string;
  ChangeTime: string;
  StartTime: string;
  ParentJobId: string;
  TaskId: string;
  CommandLine: string;
  WorkDirectory: string;
  RequiredNodes: string;
  DependsOn: string;
  IsExclusive: string;
  IsRerunnable: string;
  StdOutFilePath: string;
  StdInFilePath: string;
  StdErrFilePath: string;
  ExitCode: string;
  RequeueCount: string;
  StartValue: string;
  EndValue: string;
  IncrementValue: string;
  ErrorMessage: string;
  Output: string;
  HasRuntime: string;
  UserBlob: string;
  Type: string;
  IsServiceConcluded: string;
  FailJobOnFailure: string;
  FailJobOnFailureCount: string;
  AllocatedCoreIds: string;
  AllocatedNodes: string;
  JobTaskId: string;
  InstanceId: string;
  TaskValidExitCodes: string;
  ExitIfPossible: string;
  ExecutionFailureRetryCount: string;
  AutoRequeueCount: string;
  RequestedNodeGroup: string;

  update(other: Task): void {
    for (let key of Task.properties) {
      (this as any)[key] = (other as any)[key];
    }
  }

  static readonly properties = [
    "Name",
    "State",
    "PreviousState",
    "MinCores",
    "MaxCores",
    "MinNodes",
    "MaxNodes",
    "MinSockets",
    "MaxSockets",
    "RuntimeSeconds",
    "SubmitTime",
    "CreateTime",
    "EndTime",
    "ChangeTime",
    "StartTime",
    "ParentJobId",
    "TaskId",
    "CommandLine",
    "WorkDirectory",
    "RequiredNodes",
    "DependsOn",
    "IsExclusive",
    "IsRerunnable",
    "StdOutFilePath",
    "StdInFilePath",
    "StdErrFilePath",
    "ExitCode",
    "RequeueCount",
    "StartValue",
    "EndValue",
    "IncrementValue",
    "ErrorMessage",
    "Output",
    "HasRuntime",
    "UserBlob",
    "Type",
    "IsServiceConcluded",
    "FailJobOnFailure",
    "FailJobOnFailureCount",
    "AllocatedCoreIds",
    "AllocatedNodes",
    "JobTaskId",
    "InstanceId",
    "TaskValidExitCodes",
    "ExitIfPossible",
    "ExecutionFailureRetryCount",
    "AutoRequeueCount",
    "RequestedNodeGroup",
  ].sort();

  static fromProperties(properties: Array<RestProperty>): Task {
    let task = new Task();
    properties.forEach(prop => {
      (task as any)[prop.Name] = prop.Value;
    });
    return task;
  }
}

