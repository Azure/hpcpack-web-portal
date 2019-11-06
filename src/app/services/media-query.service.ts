import { Injectable } from '@angular/core';

export type WidthChangeEventHandler = (q: MediaQueryService) => void;

@Injectable({
  providedIn: 'root'
})
export class MediaQueryService {
  private smallWidthQuery: MediaQueryList = window.matchMedia("(max-width: 559px)");

  private medianWidthQuery: MediaQueryList = window.matchMedia("(min-width: 560px) and (max-width: 1023px)");

  private bigWidthQuery: MediaQueryList = window.matchMedia("(min-width: 1024px)");

  private handlers: WidthChangeEventHandler[] = [];

  //To capture correct "this", it has to be an arrow function, which is to be
  //passed to addEventListener. And, to removeEventListener, it requires a
  //reference to the listener.
  private readonly widtchChangeListener = () => {
    this.handlers.forEach(h => h(this));
  }

  constructor() {
    this.smallWidthQuery.addEventListener('change', this.widtchChangeListener);
    this.medianWidthQuery.addEventListener('change', this.widtchChangeListener);
    this.bigWidthQuery.addEventListener('change', this.widtchChangeListener);
  }

  get smallWidth(): boolean {
    return this.smallWidthQuery.matches;
  }

  get medianWidth(): boolean {
    return this.medianWidthQuery.matches;
  }

  get bigWidth(): boolean {
    return this.bigWidthQuery.matches;
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
