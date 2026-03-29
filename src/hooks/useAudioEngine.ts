/**
 * @file useAudioEngine.ts
 *
 * @description
 * Manages the Web Audio API for synthesizing sounds during sorting operations.
 * Maps array values to audible frequencies to create a unique sonic signature
 * for each sorting algorithm.
 *
 * @architecture
 * LAZY INITIALIZATION:
 * Browsers enforce strict autoplay policies. AudioContext cannot be initialized
 * or resumed until a user gesture occurs. We initialize it lazily inside the
 * `playNote` function or upon toggling to ensure compliance.
 *
 * EXPONENTIAL ENVELOPE:
 * Raw oscillators create harsh "clicks" when stopping and starting abruptly.
 * We use a `GainNode` with an exponential ramp-down to create a smooth,
 * pleasant "pluck" or "beep" sound.
 */

import { useRef, useState, useCallback, useEffect } from 'react';

type PlayNoteFn = (value: number, maxVal: number) => void;

export function useAudioEngine(): [PlayNoteFn, boolean, () => void] {
  const [isEnabled, setIsEnabled] = useState(true); //enabled by default
  const audioCtxRef = useRef<AudioContext | null>(null);

  /**
   * Cleans up the audio context if the component unmounts.
   */
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(console.error);
      }
    };
  }, []);

  const toggle = useCallback(() => {
    setIsEnabled((prev) => {
      const nextState = !prev;

      //Pre-warm the AudioContext on the toggle gesture to ensure it is allowed
      if (nextState && !audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      return nextState;
    });
  }, []);

  const playNote = useCallback(
    (value: number, maxVal: number) => {
      if (!isEnabled) return;

      //Failsafe initialization in case it wsn't caught by the toggle
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return; // Browser does not support Web Audio API
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;

      //resume context if browser suspended it
      if (ctx.state === 'suspended') {
        ctx.resume().catch(console.error);
      }

      //Map the array value to a freq range of 200Hz to 1200Hz
      //Avoid division by zero if maxVal is 0
      const safeMax = maxVal === 0 ? 1 : maxVal;
      const freq = 200 + (value / safeMax) * 1000;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      //'triangle' and 'sine' provide smoother  retro style beeps without harsh overtones
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      //Envelope configuration: Start at 10% volume and decay instantly to avoid clicking
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.08);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.08);
    },
    [isEnabled]
  );

  return [playNote, isEnabled, toggle];
}
