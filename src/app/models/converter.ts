import { RestProperty } from '../services/api.service'

export interface TypeConverter<T> {
  (arg: string): T;
}

export interface PropertyDefinition {
  name: string;
  type: TypeConverter<String> | TypeConverter<String[]> | TypeConverter<Number> | TypeConverter<Boolean> | TypeConverter<Date>;
}

//Convert node/job/task properties to Node/Job/Task object
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

export interface TypeConverter2<T> {
  (arg: any): T;
}

export interface PropertyDefinition2 {
  name: string;
  type: TypeConverter2<any>;
}

//It serves as a type indicator in PropertyDefinition2
export function Strings(input: string[]): string[] {
  return input;
}

//Convert a JSON object to a normalized TS object.
export function convert2<T>(object: any, ctor: new () => T, propertyDefinitions: PropertyDefinition2[]): T {
  let newObj = new ctor();
  for (let p of propertyDefinitions) {
    let value = object[p.name];
    if (p.type == Date) {
      (newObj as any)[p.name] = new Date(value);
    }
    else if (p.type == String || p.type == Number || p.type == Boolean || p.type == Strings) {
      (newObj as any)[p.name] = value;
    }
    else {
      (newObj as any)[p.name] = p.type(value);
    }
  }
  return newObj;
}