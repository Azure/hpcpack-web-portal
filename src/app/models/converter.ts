import { RestProperty } from '../services/api.service'

interface PropertyDefinition {
  name: string;
  type: new (arg: string) => object;
}

export function convert<T>(properties: Array<RestProperty>, ctor: new () => T, propertyDefinitions: Map<string, PropertyDefinition>): T {
  let obj = new ctor();
  for (let prop of properties) {
    let p = propertyDefinitions.get(prop.Name);
    if (p && prop.Value !== '') {
      let value;
      if (p.type == Date) {
        value = prop.Value + ' UTC';
      }
      else {
        value = prop.Value;
      }
      (obj as any)[p.name] = new p.type(value);
    }
  }
  return obj;
}