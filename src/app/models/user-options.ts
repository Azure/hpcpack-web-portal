export interface NodeOptions {
  selectedColumns: string[];
}

//NOTE: ensure all user options have a default value.
export class UserOptions {
  nodeOptions: NodeOptions = { selectedColumns: ['Id', 'Name', 'State', 'Health', 'Groups'] };
}