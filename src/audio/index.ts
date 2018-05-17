import { EventEmitter } from 'events';
import { Observable, of, merge, fromEvent, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { start as startTimer, stop as stopTimer, getTimer$ } from './Timer';
import { getContext, Context } from './Audio';
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
    console.log(d);
    ring1.next(d);
  });
const drone = createDrone(getContext(), audioLoader$);
getTimer$()
  .subscribe((d) => {
    drone.next(d);
  });

const START = 'start';
const STOP = 'stop';
const CHANGE_VOL = 'changeVol';

const noise = createNoise(context);
merge(
  fromEvent(ev, START).pipe(map(_ => START)),
  fromEvent(ev, STOP).pipe(map(_ => STOP))
)
.subscribe((d: string) => {
  noise.next(d);
});

//TODO: I want to use Ramda.js in this case...
const createUserEventWithContext$ = (event$: Observable<{}>, fn: Function) =>
  combineLatest(
    of(getContext()),
    event$,
    fn
  )

createUserEventWithContext$(fromEvent(ev, START), (context: Context) => context)
.subscribe((context: Context) => {
  context.audioContext.resume();
  startTimer();
});

createUserEventWithContext$(fromEvent(ev, STOP), (context: Context) => context)
.subscribe((context: Context) => {
  stopTimer();
  context.audioContext.suspend();
});

createUserEventWithContext$(fromEvent(ev, CHANGE_VOL), (context: Context, vol: number) => ({ context, vol }))
.subscribe(({ context , vol }) => {
  context.changeVolume(vol);
});

export const start = () => ev.emit(START);
export const stop = () => ev.emit(STOP);
export const changeVol = (n: number) => ev.emit(CHANGE_VOL, n);
