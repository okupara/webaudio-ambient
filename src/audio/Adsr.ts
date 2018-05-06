export interface TimeAndVal {
  time: number; // sec
  value: number;
}

export interface Adsr {
  duration: number; // sec
  attack: TimeAndVal;
  decay: number; // sec
  sustain: number;
  release: TimeAndVal;
}

export class AdsrGain {
  duration: number;
  offset: number;
  gainNode: GainNode;
  constructor (duration: number, offset: number, gainNode: GainNode) {
    this.duration = duration;
    this.gainNode = gainNode;
  }
  connectToGainNode(gainNode: GainNode) {
    this.gainNode.connect(gainNode);
  }
  beConnectedFromNode(node: AudioNode) {
    node.connect(this.gainNode);
  }
}

export const makeAdsrGain = (adsr: Adsr, timeOfPlay: number, context: AudioContext): GainNode => {
  const gainNode = context.createGain();
  // const start = timeOfPly;
  const timeSustainEnd = timeOfPlay + adsr.duration - adsr.release.time;
  const timeAttackEnd = timeOfPlay + adsr.attack.time;
  const timeDecayEnd = timeAttackEnd + adsr.decay;

  gainNode.gain.linearRampToValueAtTime(0, timeOfPlay);
  gainNode.gain.linearRampToValueAtTime(adsr.attack.value, timeAttackEnd);
  gainNode.gain.linearRampToValueAtTime(adsr.sustain, timeDecayEnd);
  gainNode.gain.linearRampToValueAtTime(adsr.sustain, timeSustainEnd);
  gainNode.gain.linearRampToValueAtTime(0, timeOfPlay + adsr.duration);
  // console.log(adsr.duration, timeAttackEnd, timeDecayEnd, timeSustainEnd, timeOfPlay + adsr.duration);
  return gainNode;
}
