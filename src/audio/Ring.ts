import { Observable } from 'rxjs';
import { ContextWithAudioBuffer, playSourceNodeWithAdsr, Context } from "./Audio";
import { Adsr, makeAdsrGain } from './Adsr';
import {
  calcApartSinPattern2,
  calcApartSinPattern1,
  prove,
  calcPlaybackRate,
  chooseElementRandomly
} from './util';
import { createTimerSubject } from './Timer';

const notes = [0, -1, -4, -7];
const patternFns = [calcApartSinPattern1, calcApartSinPattern2];

class PlayingAdsrList {
  list: Array<Adsr>;
  endTime: number;
  constructor () {
    this.endTime = 0;
  }
  play (c: ContextWithAudioBuffer) {
    const { context, audioBuffer } = c;
    const { audioContext } = context;
    const startTime = audioContext.currentTime;

    let acc = 0;
    let sz = Math.floor(Math.random() * 20) + 8;
    const note = chooseElementRandomly(notes);
    const patternFn = determinePatternFn();

    Array.from(Array(sz)).forEach((_, i, v) => {
      let nv = patternFn(i/sz);
      nv = nv * 0.7;
      const whenPlay = startTime + acc + 0.02;
      const adsr = determineADSR(nv);
      const adsrGain = makeAdsrGain(adsr, whenPlay, audioContext);

      playSourceNodeWithAdsr({
        master: context,
        audioBuffer,
        adsrGain,
        timeStart: whenPlay,
        position: (Math.random() * 1.8) + 0.15,
        pitch: calcPlaybackRate(note),
        duration: adsr.duration
      });
      acc = acc + nv;
    });
    this.endTime = startTime + acc;
  }
  isPlaying (currentTime: number) {
    if (this.endTime > currentTime) {
      return true;
    }
    return false;
  }
};

export type DataMakingRing = ContextWithAudioBuffer & {
  playingAdsrList: PlayingAdsrList;
};

export const updatePlayingAdsrList = (acc: DataMakingRing | null, context: ContextWithAudioBuffer): DataMakingRing => {
  if (!acc) {
    return {
      ...context,
      playingAdsrList: new PlayingAdsrList()
    };
  }
  const { audioContext } = context.context;
  const { playingAdsrList } = acc;
  const { currentTime } = audioContext
  if (playingAdsrList.isPlaying(currentTime) === false) {
    playingAdsrList.play(context);
  }
  return acc;
};

const determineADSR = (nextValue: number): Adsr => {
  let duration = nextValue;
  duration = Math.max(duration, 0.02);
  duration = Math.min(duration, 0.2);

  let releaseVal = 0.005;
  if (duration > 0.25) {
    releaseVal = 0.1;
  }
  return {
    duration,
    attack: { value: 3.2, time: 0.005 },
    decay: 0.005,
    sustain: 0.4,
    release: { value: 0, time: releaseVal }
  };
}

const determinePatternFn = () => patternFns[prove(0.3) ? 0 : 1];

const determineNextLimit = (min: number, randomizeRange: number) => min + Math.floor(Math.random() * randomizeRange);

const minLimitOfTimer = 20;

export default (context: Context, audioFileLoader$: Observable<AudioBuffer>) => {
  const ticker = createTimerSubject(minLimitOfTimer);
  Observable.combineLatest(
    audioFileLoader$,
    ticker.observable,
    Observable.of(new PlayingAdsrList()),
    (audioBuffer, timerData, playingAdsrList) => ({ audioBuffer, timerData, playingAdsrList })
  )
  .subscribe(({ audioBuffer, timerData, playingAdsrList }) => {
    const currentTime = context.audioContext.currentTime;
    if (playingAdsrList.isPlaying(currentTime))
      return;
    timerData.limit = determineNextLimit(minLimitOfTimer, 180);
    console.log(timerData.limit);
    playingAdsrList.play({ context, audioBuffer });
  });
  return ticker.subject;
}
