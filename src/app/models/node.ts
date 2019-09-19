import { RestProperty } from '../api-client/model/models'

export class Node {
  Name: string;
  State: string;
  Reachable: boolean;
  NodeGroups: string;

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