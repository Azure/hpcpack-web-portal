export interface NodeOptions {
  selectedColumns?: string[];
}

export interface JobOptions {
  selectedColumns?: string[];
}

//NOTE: ensure all user options have a default value.
export class UserOptions {
  nodeOptions: NodeOptions = {};
  jobOptions: JobOptions = {};
}