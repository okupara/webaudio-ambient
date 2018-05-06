import { Observable } from 'rxjs';
import { EventEmitter } from 'events';
import { Subject } from 'rxjs';

const worker = new Worker('./scheduler.js');
const ev = new EventEmitter();

worker.onmessage = (d) => ev.emit('tick', d);

export const start = () => worker.postMessage('START');

export const stop = () => worker.postMessage('STOP');

export interface TimerData {
  elapsed: number;
  cnt: number;
}

export type TimerSubject = Subject<TimerData>;

const timer$ =
  Observable.fromEvent<MessageEvent>(ev, 'tick')
    .map((x:MessageEvent): TimerData => x.data as TimerData)
    .shareReplay()

export const getTimer$ = () => timer$

export const createTimerSubject = (limit: number) => {
  const subject: TimerSubject = new Subject();
  const observable = subject
    .asObservable()
    .scan((acc, x) => {
      acc.update(x.elapsed);
      return acc;
    }, new TickEventTrigger(limit))
    .filter(x => x.determineFire())
    .publish();
  observable.connect();
  return { subject, observable };
}

export class TickEventTrigger {
  elapsed: number;
  count: number;
  limit: number;
  countTriggered: number;
  constructor (limit: number) {
    this.count = 0;
    this.elapsed = 0;
    this.countTriggered = 0;
    this.limit = limit;
  }
  update (elapsed: number) {
    this.count = this.count + 1;
    this.elapsed = elapsed;
  }
  determineFire () {
    if (this.count >= this.limit) {
      this.count = 0;
      this.countTriggered = this.countTriggered + 1;
      return true;
    }
    return false;
  }
}

