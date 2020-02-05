import { RestProperty } from '../services/api.service'

export class Task {
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
  SubmitTime: Date;
  CreateTime: Date;
  EndTime: Date;
  ChangeTime: Date;
  StartTime: Date;
  ParentJobId: number;
  TaskId: string;
  CommandLine: string;
  WorkDirectory: string;
  RequiredNodes: string;
  DependsOn: string;
  IsExclusive: boolean;
  IsRerunnable: boolean;
  StdOutFilePath: string;
  StdInFilePath: string;
  StdErrFilePath: string;
  ExitCode: number;
  RequeueCount: number;
  StartValue: number;
  EndValue: number;
  IncrementValue: number;
  ErrorMessage: string;
  Output: string;
  HasRuntime: boolean;
  UserBlob: string;
  Type: string;
  IsServiceConcluded: boolean;
  FailJobOnFailure: boolean;
  FailJobOnFailureCount: number;
  AllocatedCoreIds: string;
  AllocatedNodes: string;
  JobTaskId: number;
  InstanceId: number;
  TaskValidExitCodes: string;
  ExitIfPossible: boolean;
  ExecutionFailureRetryCount: number;
  AutoRequeueCount: number;
  RequestedNodeGroup: string;

  update(other: Task): void {
    for (let p of Task.properties) {
      (this as any)[p.name] = (other as any)[p.name];
    }
  }

  static readonly properties = [
    { name: 'Name', label: 'Name', type: String },
    { name: 'State', label: 'State', type: String },
    { name: 'PreviousState', label: 'Previous State', type: String },
    { name: 'MinCores', label: 'Min Cores', type: String },
    { name: 'MaxCores', label: 'Max Cores', type: String },
    { name: 'MinNodes', label: 'Min Nodes', type: String },
    { name: 'MaxNodes', label: 'Max Nodes', type: String },
    { name: 'MinSockets', label: 'Min Sockets', type: String },
    { name: 'MaxSockets', label: 'Max Sockets', type: String },
    { name: 'RuntimeSeconds', label: 'Runtime Seconds', type: String },
    { name: 'SubmitTime', label: 'Submit Time', type: Date },
    { name: 'CreateTime', label: 'Create Time', type: Date },
    { name: 'EndTime', label: 'End Time', type: Date },
    { name: 'ChangeTime', label: 'Change Time', type: Date },
    { name: 'StartTime', label: 'Start Time', type: Date },
    { name: 'ParentJobId', label: 'Parent Job Id', type: Number },
    { name: 'TaskId', label: 'Task Id', type: String },
    { name: 'CommandLine', label: 'Command Line', type: String },
    { name: 'WorkDirectory', label: 'Work Directory', type: String },
    { name: 'RequiredNodes', label: 'Required Nodes', type: String },
    { name: 'DependsOn', label: 'Depends On', type: String },
    { name: 'IsExclusive', label: 'Is Exclusive', type: Boolean },
    { name: 'IsRerunnable', label: 'Is Rerunnable', type: Boolean },
    { name: 'StdOutFilePath', label: 'StdOut File Path', type: String },
    { name: 'StdInFilePath', label: 'StdIn File Path', type: String },
    { name: 'StdErrFilePath', label: 'StdErr File Path', type: String },
    { name: 'ExitCode', label: 'Exit Code', type: Number },
    { name: 'RequeueCount', label: 'Requeue Count', type: Number },
    { name: 'StartValue', label: 'Start Value', type: Number },
    { name: 'EndValue', label: 'End Value', type: Number },
    { name: 'IncrementValue', label: 'Increment Value', type: Number },
    { name: 'ErrorMessage', label: 'Error Message', type: String },
    { name: 'Output', label: 'Output', type: String },
    { name: 'HasRuntime', label: 'Has Runtime', type: Boolean },
    { name: 'UserBlob', label: 'User Blob', type: String },
    { name: 'Type', label: 'Type', type: String },
    { name: 'IsServiceConcluded', label: 'Is Service Concluded', type: Boolean },
    { name: 'FailJobOnFailure', label: 'Fail Job On Failure', type: Boolean },
    { name: 'FailJobOnFailureCount', label: 'Fail Job On Failure Count', type: Number },
    { name: 'AllocatedCoreIds', label: 'Allocated Core Ids', type: String },
    { name: 'AllocatedNodes', label: 'Allocated Nodes', type: String },
    { name: 'JobTaskId', label: 'Job Task Id', type: Number },
    { name: 'InstanceId', label: 'Instance Id', type: Number },
    { name: 'TaskValidExitCodes', label: 'Task Valid Exit Codes', type: String },
    { name: 'ExitIfPossible', label: 'Exit If Possible', type: Boolean },
    { name: 'ExecutionFailureRetryCount', label: 'Execution Failure Retry Count', type: Number },
    { name: 'AutoRequeueCount', label: 'Auto Requeue Count', type: Number },
    { name: 'RequestedNodeGroup', label: 'Requested Node Group', type: String },
  ].sort((a, b) => {
    if (a.label == b.label) {
      return 0;
    }
    return a.label < b.label ? -1 : 1;
  });

  static readonly propertyMap = new Map(Task.properties.map(p => [p.name, p]));

  static fromProperties(properties: Array<RestProperty>): Task {
    let task = new Task();
    for (let prop of properties) {
      let p = Task.propertyMap.get(prop.Name);
      if (p && prop.Value !== '') {
        (task as any)[p.name] = new p.type(prop.Value);
      }
    }
    return task;
  }
}

