export interface NodeOptions {
  selectedColumns: string[];
}

export class UserOptions {
  nodeOptions: NodeOptions = { selectedColumns: ['Id', 'Name', 'State', 'Health', 'Groups'] };
}