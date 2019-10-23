import { Injectable } from '@angular/core';

export type WidthChangeEventHandler = (q: MediaQueryService) => void;

@Injectable({
  providedIn: 'root'
})
export class MediaQueryService {
  private widthQuery: MediaQueryList = window.matchMedia("(max-width: 560px)");

  private handlers: WidthChangeEventHandler[] = [];

  //To capture correct "this", it has to be an arrow function, which is to be
  //passed to addEventListener. And, to removeEventListener, it requires a
  //reference to the listener.
  private readonly widtchChangeListener = () => {
    this.handlers.forEach(h => h(this));
  }

  constructor() {
    this.widthQuery.addEventListener('change', this.widtchChangeListener);
  }

  get smallWidth(): boolean {
    return this.widthQuery.matches;
  }

  addWidthChangeEventHandler(h: WidthChangeEventHandler): void {
    this.handlers.push(h);
  }

  removeWidthChangeEventHandler(h: WidthChangeEventHandler): void {
    let idx = this.handlers.indexOf(h);
    if (idx >= 0) {
      this.handlers.splice(idx, 1);
    }
  }
}
