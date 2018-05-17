import { from } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

export const calcPlaybackRate = (distance: number) => Math.pow(2, distance / 12);

export const calcApartSinPattern1 = (x: number) => Math.sin(Math.PI / 2 * x + Math.PI) + 1;

export const calcApartSinPattern2 = (x: number) =>
  Math.sin(Math.PI / 2 * x - Math.PI / 2) + 1;

export const chooseElementRandomly = <T>(array: Array<T>): T  =>
  array[Math.floor(Math.random() * array.length)];

export const calc01SinPattern = (x: number) => (Math.sin(x + (3 * Math.PI / 2)) + 1) / 2;

export const prove = (chance: number) => {
  if (chance >= 1.0) {
    return true;
  }
  const r = Math.random();
  if (chance > r) {
    return true;
  }
  return false;
};

export const wrapAt = <T>(array: Array<T>, index: number): T => array[index % array.length];

export const fetchAudioFile = (url: string): Promise<ArrayBuffer> =>
  fetch(url).then(res => res.arrayBuffer());

export const createAudioLoader$ = (audioContext: AudioContext, url: string) =>
  from(fetchAudioFile(url))
    .pipe(
      switchMap(ArrayBuffer => audioContext.decodeAudioData(ArrayBuffer)),
      shareReplay()
    );
