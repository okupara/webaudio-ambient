import { Subject, from } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';
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
  from(addModuleOnWorklet(audioContext, url))

export default (context: Context) => {
  const subject: Subject<string> = new Subject();

  loadModule$(context.audioContext, 'pinknoise.js')
    .pipe(
      map(_ => {
        const noise = new AudioWorkletNode(context.audioContext, 'noise');
        const gainNode = context.audioContext.createGain();
        gainNode.gain.value = 0;
        noise.connect(gainNode);
        gainNode.connect(context.compressor);
        return gainNode;
      }),
      combineLatest(subject, (gainNode, trigger: string) => ({ gainNode, trigger }))
    )
    .subscribe(({ gainNode, trigger }) => {
      const now = context.audioContext.currentTime;
      if (trigger === 'start') {
        gainNode.gain.linearRampToValueAtTime(0.48, now + 0.1);
      }
      else if (trigger === 'stop') {
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
      }
    });
  return subject;
}
