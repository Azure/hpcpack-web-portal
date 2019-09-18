export class Node {
  name: string;
  state: string;
  reachable: boolean;
  nodeGroups: string;

  get health(): string {
    return this.reachable ? 'OK' : 'Error';
  }
}