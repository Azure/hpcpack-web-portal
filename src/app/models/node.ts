import { RestProperty } from '../services/api.service'

export class Node {
  //TODO: convert string to real type
  Availability: string;
  AzureServiceName: string;
  CpuSpeed: string; //number;
  DnsSuffix: string;
  Guid: string;
  Id: string; //number;
  JobType: string;
  Location: string;
  MemorySize: string; //number;
  Name: string;
  NodeGroups: string;
  NumCores: string; //number;
  NumSockets: string; //number;
  OfflineTime: string;
  OnlineTime: string;
  Reachable: boolean;
  State: string;

  update(other: Node): void {
    for (let key of Node.properties) {
      (this as any)[key] = (other as any)[key];
    }
  }

  static properties = [
    'Availability',
    'AzureServiceName',
    'CpuSpeed',
    'DnsSuffix',
    'Guid',
    'Id',
    'JobType',
    'Location',
    'MemorySize',
    'Name',
    'NodeGroups',
    'NumCores',
    'NumSockets',
    'OfflineTime',
    'OnlineTime',
    'Reachable',
    'State',
  ]

  static fromProperties(properties: Array<RestProperty>): Node {
    let node = new Node();
    properties.forEach(prop => {
      (node as any)[prop.Name] = prop.Value;
    });
    return node;
  }
}
