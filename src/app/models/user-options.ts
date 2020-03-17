export interface NodeMetricOptions {
  selectedMetric?: string;
  metricRanges?: { [key:string]: { min?: number, max?: number }};
  blockSize?: number;
}

export interface NodeOptions {
  selectedColumns?: string[];
  hideActionList?: boolean;
  orderBy?: string;
  orderAsc?: boolean;
  pageSize?: number;
}

export interface NodeGroupOptions {
  hideActionList?: boolean;
}

export interface JobOptions {
  selectedColumns?: string[];
  hideActionList?: boolean;
  orderBy?: string;
  orderAsc?: boolean;
  pageSize?: number;
}

export interface TaskOptions {
  selectedColumns?: string[];
  hideActionList?: boolean;
  orderBy?: string;
  orderAsc?: boolean;
  pageSize?: number;
}

export interface LogOptions {
  selectedColumns?: string[];
  hideActionList?: boolean;
}

export interface ChartOption {
  name: string;
  timeWindow: number;
}

//NOTE: ensure all user options that are not leaves in the tree have a proper value.
//TODO: Implement dynamic getter so that new properties have proper default value in deserialized object?
export class UserOptions {
  nodeMetricOptions: NodeMetricOptions = { metricRanges: {}};
  nodeOptions: NodeOptions = {};
  nodeGroupOptions: NodeGroupOptions = {};
  jobOptions: JobOptions = {};
  taskOptions: TaskOptions = {};
  chartOptions: ChartOption[] = [];
  logOptions: LogOptions = {};
  allowTracking: boolean;
}