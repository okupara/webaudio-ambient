import { Observable } from 'rxjs';
import { DataMakingDrone, createSourceNodeWithAdsr, Context } from './Audio';
import { makeAdsrGain } from './Adsr';
import { calc01SinPattern, calcPlaybackRate } from './util';
import { createTimerSubject } from './Timer';

const process = (c: DataMakingDrone) => {
  const position1 = calc01SinPattern(c.tickEvent.countTriggered/4) * 1.6;
  const position2 = calc01SinPattern(c.tickEvent.countTriggered/3.2 + 0.2) * 2;
  const { audioContext } = c.context;
  const { audioBuffer } = c;
  const startTime = audioContext.currentTime;
  const duration = 0.55;
  const adsrGainNode1 = makeAdsrGainLocal(0.4, duration, startTime, audioContext);
  const adsrGainNode2 = makeAdsrGainLocal(0.46, duration, startTime, audioContext);

  const sourceHigh = createSourceNodeWithAdsr(c.context, adsrGainNode1, audioBuffer);
  playSample(c.context, sourceHigh, adsrGainNode1, c.splitterNode, startTime, position1, calcPlaybackRate(0), duration);

  const sourceLow = createSourceNodeWithAdsr(c.context, adsrGainNode2, audioBuffer);
  playSample(c.context, sourceLow, adsrGainNode2, c.splitterNode, startTime, position2, calcPlaybackRate(-12), duration);
};

const makeAdsrGainLocal = (vol: number, duration: number, startTime: number, audioContext: AudioContext) => makeAdsrGain({
  duration,
  attack: { time: 0.2, value: vol },
  decay: 0.05,
  sustain: vol,
  release: { time: 0.2, value: 0 }
}, startTime, audioContext);

const playSample = (context: Context,
  source: AudioBufferSourceNode,
  adsrGainNode: GainNode,
  splitterNode: ChannelSplitterNode,
  startTime: number,
  position: number,
  pitch: number,
  duration: number) => {
  adsrGainNode.connect(context.compressor);
  // adsrGainNode.connect(splitterNode);
  source.playbackRate.value = pitch;
  source.start(startTime, position, duration);
};

const createSplitterNode = (context: Context, leftDelayTime: number, rightDelayTime: number) => {
  const { audioContext } = context;
  const rightDelay = audioContext.createDelay(leftDelayTime);
  const leftDelay = audioContext.createDelay(rightDelayTime);
  const merger = audioContext.createChannelMerger(2);

  const splitterNode = audioContext.createChannelSplitter(2);
  splitterNode.connect(leftDelay, 0);
  splitterNode.connect(rightDelay, 1);
  leftDelay.connect(merger, 0, 0);
  rightDelay.connect(merger, 0, 1);
  merger.connect(context.compressor);
  return splitterNode;
};

export default (context: Context, audioLader$: Observable<AudioBuffer>) => {
  const ticker = createTimerSubject(8);
  const splitterNode = createSplitterNode(context, 0.5, 0.001);
  Observable.combineLatest(
    audioLader$,
    ticker.observable,
    (audioBuffer, timerData) => ({ audioBuffer, timerData })
  )
  .subscribe(({ audioBuffer, timerData }) => {
    process({ context, audioBuffer, tickEvent: timerData, splitterNode: splitterNode });
  });
  return ticker.subject;
};
