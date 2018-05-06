import { Observable, Subject } from 'rxjs';
import { Context } from './Audio';

interface AudioWorkletNode {
  connect(node: AudioNode): void;
}
declare var AudioWorkletNode: {
  prototype: AudioWorkletNode;
  new(context: AudioContext, key: string): AudioWorkletNode;
}

const addModuleOnWorklet = (audioContext: any, url: string): Promise<void> =>
  audioContext.audioWorklet.addModule(url);

const loadModule$ = (audioContext: AudioContext, url: string) =>
  Observable.fromPromise(addModuleOnWorklet(audioContext, url))

export default (context: Context) => {
  const subject: Subject<string> = new Subject();

  loadModule$(context.audioContext, 'pinknoise.js')
    .map(() => {
      const noise = new AudioWorkletNode(context.audioContext, 'noise');
      const gainNode = context.audioContext.createGain();
      gainNode.gain.value = 0;
      noise.connect(gainNode);
      gainNode.connect(context.masterGainNode);
      return gainNode;
    })
    .combineLatest(subject, (gainNode, trigger: string) => ({ gainNode, trigger }))
    .subscribe(({ gainNode, trigger }) => {
      const now = context.audioContext.currentTime;
      if (trigger === 'start') {
        gainNode.gain.linearRampToValueAtTime(0.78, now + 0.1);
      }
      else if (trigger === 'stop') {
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
      }
    });
  return subject;
}
