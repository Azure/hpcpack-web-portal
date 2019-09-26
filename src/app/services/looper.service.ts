import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators'

export interface ILooper<T> {
  observable: Observable<T>;

  handler: ILooperHandler<T>;

  interval: number;

  expiredIn?: number;

  readonly stopped: boolean;

  start(): void;

  stop(callHandler?: boolean): void;
}

export interface ILooperHandler<T> {
  next: (value: T, looper?: ILooper<T>) => void;
  error?: (value: any, looper?: ILooper<T>) => void;
  stop?: (looper?: ILooper<T>) => void;
}

export class Looper<T> implements ILooper<T> {
  private timer: any;

  private expiredAt: number;

  private subscription: Subscription;

  private inProgress = false;

  //Subscribe an observable repeatedly with a time interval between each
  //subscription. Only the first emit of the observable is taken.
  //The interval parameter is the LEAST time between each subscription.
  constructor(
    public observable: Observable<T>,
    public handler: ILooperHandler<T>,
    public interval: number,
    public expiredIn: number = null
  ) {}

  get stopped(): boolean {
    return !this.inProgress;
  }

  stop(callHandler: boolean = true): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    if (this.inProgress) {
      this.inProgress = false;
      if (callHandler && this.handler.stop) {
        this.handler.stop(this);
      }
    }
  }

  private nextInterval(startTime: number): number {
    let now = Date.now();
    let elapsedTime = now - startTime;
    let delta = this.interval - elapsedTime;
    let interval = delta > 0 ? delta : 0;
    return (this.expiredAt && this.expiredAt <= now + interval) ? null : interval;
  }

  start(): void {
    if (!this.stopped) {
      return;
    }
    if (this.expiredIn) {
      this.expiredAt = new Date(Date.now() + this.expiredIn).getTime();
    }
    this.inProgress = true;
    let _loop = () => {
      if (this.stopped) {
        return;
      }
      let ts = Date.now();
      this.subscription = this.observable.pipe(first()).subscribe(
        res => {
          if (this.stopped) {
            return;
          }
          this.handler.next(res, this);
          if (this.stopped) {
            return;
          }
          let _interval = this.nextInterval(ts);
          if (_interval === null) {
            this.stop();
          }
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
            let _interval = this.nextInterval(ts);
            if (_interval === null) {
              this.stop();
            }
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

  static start<T>(observable: Observable<T>, handler: ILooperHandler<T>, interval: number, expiredIn: number = null): Looper<T> {
    let looper = new Looper<T>(observable, handler, interval, expiredIn);
    looper.start();
    return looper;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LooperService {
  start<T>(observable: Observable<T>, handler: ILooperHandler<T>, interval: number, expiredIn: number = null): ILooper<T> {
    return Looper.start(observable, handler, interval, expiredIn);
  }
}