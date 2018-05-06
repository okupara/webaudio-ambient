import { EventEmitter } from 'events';
import { Observable } from 'rxjs';
import { start as startTimer, stop as stopTimer, getTimer$ } from './Timer';
import { getContext } from './Audio';
import { createAudioLoader$ } from './util';
import createRing from './Ring';
import createDrone from './Drone';
import createNoise from './Noise';
const ev = new EventEmitter();

const context = getContext();
const audioLoader$ = createAudioLoader$(context.audioContext, './sounds/pipo.mp3');

const ring1 = createRing(getContext(), audioLoader$)
getTimer$()
  .subscribe((d) => {
    ring1.next(d);
  });
const drone = createDrone(getContext(), audioLoader$);
getTimer$()
  .subscribe((d) => {
    drone.next(d);
  });

const START = 'start';
const STOP = 'stop';

const noise = createNoise(context);
Observable.merge(
  Observable.fromEvent(ev, START).map(_ => START),
  Observable.fromEvent(ev, STOP).map(_ => STOP)
)
.subscribe((d: string) => {
  noise.next(d);
});


export const start = () => {
  startTimer();
  ev.emit(START);
}
export const stop = () => {
  stopTimer();
  ev.emit(STOP);
}
