import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

export interface ILooper<T> {
  observable: Observable<T>;

  handler: ILooperHandler<T>;

  interval: number;

  readonly stopped: boolean;

  start(): void;

  stop(): void;
}

export interface ILooperHandler<T> {
  next: (value: T, looper?: ILooper<T>) => void;
  error?: (value: any, looper?: ILooper<T>) => void;
}

export class Looper<T> implements ILooper<T> {
  private timer: any;

  private subscription: Subscription;

  private inProgress = false;

  //Subscribe an observable repeatedly with a time interval between each
  //subscription. Only the first emit of the observable is taken.
  //The interval parameter is the LEAST time between each subscription.
  constructor(
    public observable: Observable<T>,
    public handler: ILooperHandler<T>,
    public interval: number) { }

  get stopped(): boolean {
    return !this.inProgress;
  }

  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.inProgress = false;
  }

  start(): void {
    if (!this.stopped) {
      return;
    }
    this.inProgress = true;
    let _loop = () => {
      if (this.stopped) {
        return;
      }
      let ts = new Date().getTime();
      this.subscription = this.observable./*pipe(first()).*/subscribe(
        res => {
          if (this.stopped) {
            return;
          }
          let elapse = new Date().getTime() - ts;
          this.handler.next(res, this);
          if (this.stopped) {
            return;
          }
          let delta = this.interval - elapse;
          let _interval = delta > 0 ? delta : 0;
          this.timer = setTimeout(_loop, _interval);
        },
        err => {
          if (this.stopped) {
            return;
          }
          if (this.handler.error) {
            this.handler.error(err, this);
            if (this.stopped) {
              return;
            }
            let elapse = new Date().getTime() - ts;
            let delta = this.interval - elapse;
            let _interval = delta > 0 ? delta : 0;
            this.timer = setTimeout(_loop, _interval);
          }
          else {
            this.stop();
          }
        }
      );
    };
    _loop();
  }

  static start<T>(observable: Observable<T>, handler: ILooperHandler<T>, interval: number): Looper<T> {
    let looper = new Looper<T>(observable, handler, interval);
    looper.start();
    return looper;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LooperService {
  start<T>(observable: Observable<T>, handler: ILooperHandler<T>, interval: number): ILooper<T> {
    return Looper.start(observable, handler, interval);
  }
}