import { OperationLog as IOperationLog, OperationLogEntry as IOperationLogEntry } from '../api-client'
import { convert2 } from './converter'

export { OperationLog as IOperationLog, OperationLogEntry as IOperationLogEntry } from '../api-client'

export class OperationLogEntry implements IOperationLogEntry {
  static readonly properties = [
    { name: 'Message', label: 'Message', type: String },
    { name: 'Severity', label: 'Severity', type: String },
    { name: 'Source', label: 'Source', type: String },
    { name: 'CreateTime', label: 'Create Time', type: Date },
  ].sort((a, b) => {
    if (a.label == b.label) {
      return 0;
    }
    return a.label < b.label ? -1 : 1;
  });

  static fromJson(object: any): OperationLogEntry {
    return convert2(object, OperationLogEntry, OperationLogEntry.properties);
  }
}

export class OperationLog implements IOperationLog {
  static readonly properties = [
    { name: 'Id', label: 'ID', type: String },
    { name: 'Name', label: 'Name', type: String },
    { name: 'State', label: 'State', type: String },
    { name: 'Operator', label: 'Operator', type: String },
    { name: 'UpdateTime', label: 'Update Time', type: Date },
    { name: 'Entries', label: 'Entries', type: OperationLog.toEntries },
  ].sort((a, b) => {
    if (a.label == b.label) {
      return 0;
    }
    return a.label < b.label ? -1 : 1;
  });

  static toEntries(input: any[]): OperationLogEntry[] {
    if (!input) {
      return null;
    }
    return input.map(e => OperationLogEntry.fromJson(e));
  }

  static fromJson(object: any): OperationLog {
    return convert2(object, OperationLog, OperationLog.properties);
  }
}