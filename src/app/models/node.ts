import { Node as INode, NodeState, NodeHealth, NodeServiceRole } from '../services/api.service'
import { convert2, Strings } from './converter'

export { Node as INode, NodeState, NodeHealth, NodeServiceRole } from '../services/api.service'

export class Node implements INode {
  Name: string;
  State: NodeState;
  Health: NodeHealth;
  Template: string;
  Location: string;
  MemorySize: number;
  Cores: number;
  Sockets: number;
  HpcPackVersion: string;
  Groups: Array<string>;
  Roles: Array<string>;
  InstalledServiceRoles: Array<NodeServiceRole>;
  ActiveServiceRoles: Array<NodeServiceRole>;

  update(other: Node): void {
    for (let prop of Node.properties) {
      (this as any)[prop.name] = (other as any)[prop.name];
    }
  }

  static readonly properties = [
    { name: 'Name', label: 'Name', type: String },
    { name: 'State', label: 'State', type: String },
    { name: 'Health', label: 'Health', type: String },
    { name: 'Template', label: 'Template', type: String },
    { name: 'Location', label: 'Location', type: String },
    { name: 'MemorySize', label: 'Memory Size', type: Number },
    { name: 'Cores', label: 'Cores', type: Number },
    { name: 'Sockets', label: 'Sockets', type: Number },
    { name: 'HpcPackVersion', label: 'HPC Pack Version', type: String },
    { name: 'Groups', label: 'Groups', type: Strings },
    { name: 'Roles', label: 'Roles', type: Strings },
    { name: 'InstalledServiceRoles', label: 'Installed Service Roles', type: Strings },
    { name: 'ActiveServiceRoles', label: 'Active Service Roles', type: Strings },
  ].sort((a, b) => {
    if (a.label == b.label) {
      return 0;
    }
    return a.label < b.label ? -1 : 1;
  });

  static fromJson(object: any): Node {
    return convert2(object, Node, Node.properties);
  }
}
