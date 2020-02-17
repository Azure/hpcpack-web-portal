export interface NodeMetricOptions {
  selectedMetric?: string;
  metricRanges?: { [key:string]: { min?: number, max?: number }};
  blockSize?: number;
}

export interface NodeOptions {
  selectedColumns?: string[];
  hideActionList?: boolean;
}

export interface JobOptions {
  selectedColumns?: string[];
  hideActionList?: boolean;
}

export interface TaskOptions {
  selectedColumns?: string[];
  hideActionList?: boolean;
}

export interface ChartOption {
  name: string;
  timeWindow: number;
}

//NOTE: ensure all user options that are not leaves in the tree have a proper value.
export class UserOptions {
  nodeMetricOptions: NodeMetricOptions = { metricRanges: {}};
  nodeOptions: NodeOptions = {};
  jobOptions: JobOptions = {};
  taskOptions: TaskOptions = {};
  chartOptions: ChartOption[] = [];
}