import { OperationLog as IOperationLog } from '../api-client'

export class OperationLog implements IOperationLog {
  static readonly properties = [
    { name: 'Id', label: 'ID', type: String },
    { name: 'Name', label: 'Name', type: String },
    { name: 'State', label: 'State', type: String },
    { name: 'Operator', label: 'Operator', type: String },
    { name: 'UpdateTime', label: 'Update Time', type: Date },
  ].sort((a, b) => {
    if (a.label == b.label) {
      return 0;
    }
    return a.label < b.label ? -1 : 1;
  });

  static fromJson(input: any): OperationLog {
    let obj = new OperationLog();
    for (let p of OperationLog.properties) {
      if (p.type == Date) {
        (obj as any)[p.name] = new Date(input[p.name])
      }
      else {
        //String is assumed
        (obj as any)[p.name] = input[p.name];
      }
    }
    return obj;
  }
}