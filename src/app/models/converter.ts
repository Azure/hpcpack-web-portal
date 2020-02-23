import { RestProperty } from '../services/api.service'

export interface TypeConverter<T> {
  (arg: string): T;
}

export interface PropertyDefinition {
  name: string;
  type: TypeConverter<String> | TypeConverter<String[]> | TypeConverter<Number> | TypeConverter<Boolean> | TypeConverter<Date>;
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
      //NOTE: Here we "convert" string by T(str), rather than new T(str). This is very important, since
      //the former gets a "primitive" of type T, while the latter gets an "object" of type T. And, JS
      //discriminates a "primitive" from an "object", so that T(str) !== new T(str), while T(str) == new T(str)!
      //If an "object" of T is set as a property of obj, then later it will get trouble when comparing it
      //with a "primitive". For example, a string litteral will not equal to(===) a string object.
      (obj as any)[p.name] = p.type(value);
    }
  }
  return obj;
}