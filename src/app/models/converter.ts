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
        //NOTE: Date("string value") doesn't convert input into a Date.
        value = new Date(prop.Value + ' UTC');
      }
      else {
        //NOTE: Here we "convert" string by T(str), rather than new T(str). This is very important, since
        //the former gets a "primitive" of type T, while the latter gets an "object" of type T. And, JS
        //discriminates a "primitive" from an "object", so that T(str) !== new T(str), while T(str) == new T(str)!
        //If an "object" of T is set as a property of obj, then later it will get trouble when comparing it
        //with a "primitive". For example, a string litteral will not equal to(===) a string object.
        value = p.type(prop.Value);
      }
      (obj as any)[p.name] = value;
    }
  }
  return obj;
}