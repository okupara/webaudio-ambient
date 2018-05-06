import { TickEventTrigger } from './Timer';
import Reverb from 'soundbank-reverb';

interface IReverb {
  time: number;
  wet: AudioParam;
  dry: AudioParam;
  filterType: string;
  cutoff: AudioParam;
  connect: (node: AudioNode) => void;
}

export class Context {
  audioContext: AudioContext;
  masterGainNode: GainNode;
  reverb: IReverb;
  compressor: DynamicsCompressorNode;
  constructor () {
    this.audioContext = new AudioContext();
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
    this.masterGainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime);
    this._initReverb();
    this._initCompressor();
  }
  changeVolume (vol: number) {
    this.masterGainNode.gain.linearRampToValueAtTime(vol, this.audioContext.currentTime + 0.05);
  }
  decodeAudio (buffer: ArrayBuffer) {
    return this.audioContext.decodeAudioData(buffer);
  }
  _initReverb () {
    this.reverb = Reverb(this.audioContext);
    this.reverb.time = 2.5 //seconds
    this.reverb.wet.value = 0.8
    this.reverb.dry.value = 0.4
    this.reverb.filterType = 'lowpass'
    this.reverb.cutoff.value = 800 //Hz
    this.reverb.connect(this.masterGainNode);
  }
  _initCompressor () {
    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-30, this.audioContext.currentTime);
    this.compressor.knee.setValueAtTime(40, this.audioContext.currentTime);
    this.compressor.ratio.setValueAtTime(8, this.audioContext.currentTime);
    this.compressor.attack.setValueAtTime(0.1, this.audioContext.currentTime);
    this.compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);
    this.compressor.connect(this.reverb as any);
  }
}

/*
interface ContextWithArrayBuffer {
  context: Context;
  arrayBuffer: ArrayBuffer;
}
*/
export interface ContextWithAudioBuffer {
  context: Context;
  audioBuffer: AudioBuffer;
}
export type DataMakingDrone = ContextWithAudioBuffer & { tickEvent: TickEventTrigger, splitterNode: ChannelSplitterNode };

const context = new Context();
export const getContext = () => context;

interface PlaySourceParams {
  master: Context;
  audioBuffer: AudioBuffer;
  adsrGain: GainNode;
  timeStart: number;
  position: number;
  pitch: number;
  duration: number;
}

export const playSourceNodeWithAdsr = ({ master, audioBuffer, adsrGain, timeStart, position, pitch, duration }: PlaySourceParams) => {
  const { audioContext, compressor } = master;
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(adsrGain);
  adsrGain.connect(compressor);
  source.playbackRate.value = pitch;
  source.start(timeStart, position, duration);
  return source;
}

export const createSourceNodeWithAdsr = (context: Context, adsrGain: GainNode, audioBuffer: AudioBuffer) => {
  const { audioContext } = context;
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(adsrGain);
  return source;
}

