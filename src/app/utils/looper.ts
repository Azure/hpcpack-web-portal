import { Observable } from 'rxjs';
import { Looper, ILooper } from '../services/looper.service';

export function oneAfterAnother<T>(observables: Observable<T>[], maxTries: number): Looper<T> {
  if (!observables) {
    return undefined;
  }
  let first = observables.shift();
  let nextOrStop = (looper: ILooper<any>) => {
    let next = observables.shift();
    if (next) {
      looper.observable = next;
    }
    else {
      looper.stop();
    }
  };
  let retries = new Map<Object, number>();
  let retryOrSkip = (looper: ILooper<any>) => {
    let v = retries.get(looper.observable);
    if (v === undefined) {
      v = 0;
    }
    if (v < maxTries) {
      v++;
      retries.set(looper.observable, v);
    }
    else {
      //Skip to the next
      nextOrStop(looper);
    }
  }
  return Looper.start(first,
    {
      next: (_, looper) => {
        nextOrStop(looper);
      },
      error: (error, looper) => {
        console.error(error);
        retryOrSkip(looper);
      }
    },
    0
  );
}