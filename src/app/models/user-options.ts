export interface NodeOptions {
  selectedColumns: string[];
}

export interface JobOptions {
  selectedColumns: string[];
}

//NOTE: ensure all user options have a default value.
export class UserOptions {
  nodeOptions: NodeOptions = { selectedColumns: ['Id', 'Name', 'State', 'Health', 'Groups'] };
  jobOptions: JobOptions = {
    selectedColumns: [
      "Id",
      "Name",
      "State",
      "Owner",
      "Progress",
      "CreateTime",
      "SubmitTime",
      "StartTime",
      "ChangeTime",
      "EndTime",
      "ErrorMessage",
    ]
  };
}