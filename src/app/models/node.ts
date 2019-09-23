import { RestProperty } from '../api-client/model/models'

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

  get Health(): string {
    return this.Reachable ? 'OK' : 'Error';
  }

  static fromProperties(properties: Array<RestProperty>): Node {
    let node = new Node();
    properties.forEach(prop => {
      (node as any)[prop.Name] = prop.Value;
    });
    return node;
  }
}