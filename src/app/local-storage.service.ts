import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private store: Map<string, any> = new Map();

  getProperty(key: string): any {
    let value = this.store.get(key);
    if (value === undefined) {
      let str = sessionStorage.getItem(key);
      if (str !== undefined && str !== null) {
        value = JSON.parse(str);
        this.store.set(key, value);
      }
    }
    return value;
  }

  setProperty(key: string, value: any): void {
    this.store.set(key, value);
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  clear(): void {
    for (let k of this.store.keys()) {
      sessionStorage.removeItem(k);
    }
    this.store.clear();
  }

  constructor() { }
}
