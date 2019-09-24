import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private store: Map<string, any> = new Map();

  protected getProperty(key: string, persistent = false): any {
    let value = this.store.get(key);
    if (value === undefined) {
      let str = persistent ? localStorage.getItem(key): sessionStorage.getItem(key);
      if (str !== undefined && str !== null) {
        value = JSON.parse(str);
        this.store.set(key, value);
      }
    }
    return value;
  }

  protected setProperty(key: string, value: any, persistent = false): void {
    this.store.set(key, value);
    let json = JSON.stringify(value);
    if (persistent) {
      localStorage.setItem(key, json);
    }
    else {
      sessionStorage.setItem(key, json);
    }
  }
}
