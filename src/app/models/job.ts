import { RestProperty } from '../services/api.service'
import { convert } from './converter'

export class Job {
  Id: number;
  Name: string;
  Owner: string;
  UserName: string;
  Project: string;
  RuntimeSeconds: number;
  SubmitTime: Date;
  CreateTime: Date;
  EndTime: Date;
  StartTime: Date;
  ChangeTime: Date;
  State: string;  //TODO: Define a type of the state literals, "Failed" | "Finished" | ...
  PreviousState: string;
  MinCores: number;
  MaxCores: number;
  MinNodes: number;
  MaxNodes: number;
  MinSockets: number;
  MaxSockets: number;
  UnitType: string;
  RequestedNodes: string;
  IsExclusive: boolean;
  RunUntilCanceled: boolean;
  NodeGroups: string;
  FailOnTaskFailure: boolean;
  AutoCalculateMax: boolean;
  AutoCalculateMin: boolean;
  CanGrow: boolean;
  CanShrink: boolean;
  Preemptable: boolean;
  ErrorMessage: string;
  HasRuntime: boolean;
  RequeueCount: number;
  MinMemory: number;
  MaxMemory: number;
  MinCoresPerNode: number;
  MaxCoresPerNode: number;
  EndpointReference: string;
  SoftwareLicense: string;
  OrderBy: string;
  ClientSource: string;
  Progress: number;
  ProgressMessage: string;
  TargetResourceCount: number;
  ExpandedPriority: number;
  ServiceName: string;
  JobTemplate: string;
  HoldUntil: Date;
  NotifyOnStart: boolean;
  NotifyOnCompletion: boolean;
  ExcludedNodes: string;
  EmailAddress: string;
  Pool: string;
  Priority: string;
  AllocatedNodes: string;
  JobValidExitCodes: string;
  ParentJobIds: string;
  FailDependentTasks: boolean;
  NodeGroupOp: string;
  SingleNode: boolean;
  ChildJobIds: string;
  EstimatedProcessMemory: number;
  PlannedCoreCount: number;
  TaskExecutionFailureRetryLimit: number;

  get Ended(): boolean {
    return ['Finished', 'Failed', 'Canceled'].includes(this.State);
  }

  update(other: Job): void {
    for (let p of Job.properties) {
      (this as any)[p.name] = (other as any)[p.name];
    }
  }

  static readonly properties = [
    { name: 'Id', label: 'Id', type: Number },
    { name: 'Name', label: 'Name', type: String },
    { name: 'Owner', label: 'Owner', type: String },
    { name: 'UserName', label: 'User Name', type: String },
    { name: 'Project', label: 'Project', type: String },
    { name: 'RuntimeSeconds', label: 'Runtime Seconds', type: Number },
    { name: 'SubmitTime', label: 'Submit Time', type: Date },
    { name: 'CreateTime', label: 'Create Time', type: Date },
    { name: 'EndTime', label: 'End Time', type: Date },
    { name: 'StartTime', label: 'Start Time', type: Date },
    { name: 'ChangeTime', label: 'Change Time', type: Date },
    { name: 'State', label: 'State', type: String },
    { name: 'PreviousState', label: 'Previous State', type: String },
    { name: 'MinCores', label: 'Min Cores', type: Number },
    { name: 'MaxCores', label: 'Max Cores', type: Number },
    { name: 'MinNodes', label: 'Min Nodes', type: Number },
    { name: 'MaxNodes', label: 'Max Nodes', type: Number },
    { name: 'MinSockets', label: 'Min Sockets', type: Number },
    { name: 'MaxSockets', label: 'Max Sockets', type: Number },
    { name: 'UnitType', label: 'Unit Type', type: String },
    { name: 'RequestedNodes', label: 'Requested Nodes', type: String },
    { name: 'IsExclusive', label: 'Is Exclusive', type: Boolean },
    { name: 'RunUntilCanceled', label: 'Run Until Canceled', type: Boolean },
    { name: 'NodeGroups', label: 'Node Groups', type: String },
    { name: 'FailOnTaskFailure', label: 'Fail On Task Failure', type: Boolean },
    { name: 'AutoCalculateMax', label: 'Auto Calculate Max', type: Boolean },
    { name: 'AutoCalculateMin', label: 'Auto Calculate Min', type: Boolean },
    { name: 'CanGrow', label: 'Can Grow', type: Boolean },
    { name: 'CanShrink', label: 'Can Shrink', type: Boolean },
    { name: 'Preemptable', label: 'Preemptable', type: Boolean },
    { name: 'ErrorMessage', label: 'Error Message', type: String },
    { name: 'HasRuntime', label: 'Has Runtime', type: Boolean },
    { name: 'RequeueCount', label: 'Requeue Count', type: Number },
    { name: 'MinMemory', label: 'Min Memory', type: Number },
    { name: 'MaxMemory', label: 'Max Memory', type: Number },
    { name: 'MinCoresPerNode', label: 'Min Cores Per Node', type: Number },
    { name: 'MaxCoresPerNode', label: 'Max Cores Per Node', type: Number },
    { name: 'EndpointReference', label: 'Endpoint Reference', type: String },
    { name: 'SoftwareLicense', label: 'Software License', type: String },
    { name: 'OrderBy', label: 'Order By', type: String },
    { name: 'ClientSource', label: 'Client Source', type: String },
    { name: 'Progress', label: 'Progress', type: Number },
    { name: 'ProgressMessage', label: 'Progress Message', type: String },
    { name: 'TargetResourceCount', label: 'Target Resource Count', type: Number },
    { name: 'ExpandedPriority', label: 'Expanded Priority', type: Number },
    { name: 'ServiceName', label: 'Service Name', type: String },
    { name: 'JobTemplate', label: 'Job Template', type: String },
    { name: 'HoldUntil', label: 'Hold Until', type: Date },
    { name: 'NotifyOnStart', label: 'Notify On Start', type: Boolean },
    { name: 'NotifyOnCompletion', label: 'Notify On Completion', type: Boolean },
    { name: 'ExcludedNodes', label: 'Excluded Nodes', type: String },
    { name: 'EmailAddress', label: 'Email Address', type: String },
    { name: 'Pool', label: 'Pool', type: String },
    { name: 'Priority', label: 'Priority', type: String },
    { name: 'AllocatedNodes', label: 'Allocated Nodes', type: String },
    { name: 'JobValidExitCodes', label: 'Job Valid Exit Codes', type: String },
    { name: 'ParentJobIds', label: 'Parent Job Ids', type: String },
    { name: 'FailDependentTasks', label: 'Fail Dependent Tasks', type: Boolean },
    { name: 'NodeGroupOp', label: 'Node Group Op', type: String },
    { name: 'SingleNode', label: 'Single Node', type: Boolean },
    { name: 'ChildJobIds', label: 'Child Job Ids', type: String },
    { name: 'EstimatedProcessMemory', label: 'Estimated Process Memory', type: Number },
    { name: 'PlannedCoreCount', label: 'Planned Core Count', type: Number },
    { name: 'TaskExecutionFailureRetryLimit', label: 'Task Execution Failure Retry Limit', type: Number },
  ].sort((a, b) => {
    if (a.label == b.label) {
      return 0;
    }
    return a.label < b.label ? -1 : 1;
  });

  static readonly propertyMap = new Map(Job.properties.map(p => [p.name, p]));

  static fromProperties(properties: Array<RestProperty>): Job {
    return convert(properties, Job, Job.propertyMap);
  }
}