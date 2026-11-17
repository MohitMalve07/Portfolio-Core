import type { SectionId } from '../data/navigation';

export interface AudioStateSnapshot {
  isMuted: boolean;
  isUnlocked: boolean;
}

const BGM_URL = '/audio/bgm.mp3';
const FIRE_URL = '/audio/fire_crackle.mp3';
const CLICK_URL = '/audio/click.wav';

const BGM_TARGET_VOLUME = 0.22;
const CLICK_GAIN_VALUE = 0.36;

function getFireTargetVolume(section: SectionId | null): number {
  if (section === 'contact') return 0.28; // Closest to the stone fireplace & mantel
  if (section === null || section === 'about') return 0.21; // Overview / corkboard near hearth
  return 0.14; // Desk, Trophy Shelf, and Skill Tree across the cabin
}

class WorkshopAudioController {
  private bgm: HTMLAudioElement | null = null;
  private fire: HTMLAudioElement | null = null;
  private fallbackClick: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private clickBuffer: AudioBuffer | null = null;
  private clickFetchPromise: Promise<void> | null = null;

  private isMuted = false;
  private isUnlocked = false;
  private currentSection: SectionId | null = null;
  private fadeRafId: number | null = null;
  private lastClickAt = 0;
  private listeners = new Set<(state: AudioStateSnapshot) => void>();

  private ensureAudioElements(): void {
    if (typeof window === 'undefined') return;

    if (!this.bgm) {
      const bgm = new Audio(BGM_URL);
      bgm.loop = true;
      bgm.preload = 'auto';
      bgm.volume = 0;
      this.bgm = bgm;
    }

    if (!this.fire) {
      const fire = new Audio(FIRE_URL);
      fire.loop = true;
      fire.preload = 'auto';
      fire.volume = 0;
      this.fire = fire;
    }
  }

  private playFallbackClick(): void {
    if (!this.fallbackClick) {
      const click = new Audio(CLICK_URL);
      click.preload = 'none';
      click.volume = CLICK_GAIN_VALUE;
      this.fallbackClick = click;
    }
    const clone = this.fallbackClick.cloneNode(true) as HTMLAudioElement;
    clone.volume = CLICK_GAIN_VALUE;
    void clone.play().catch(() => {});
  }

  private ensureAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (Ctx) {
        this.audioCtx = new Ctx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      void this.audioCtx.resume().catch(() => {});
    }
    if (this.audioCtx && !this.clickBuffer && !this.clickFetchPromise) {
      this.clickFetchPromise = fetch(CLICK_URL)
        .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject()))
        .then((arr) => this.audioCtx!.decodeAudioData(arr))
        .then((buf) => {
          this.clickBuffer = buf;
        })
        .catch(() => {
          // Fallback HTMLAudioElement handles playback if fetch/decode fails
        });
    }
    return this.audioCtx;
  }

  private notify(): void {
    const snap = this.getSnapshot();
    for (const cb of this.listeners) {
      cb(snap);
    }
  }

  public getSnapshot(): AudioStateSnapshot {
    return { isMuted: this.isMuted, isUnlocked: this.isUnlocked };
  }

  public subscribe(cb: (state: AudioStateSnapshot) => void): () => void {
    this.listeners.add(cb);
    cb(this.getSnapshot());
    return () => {
      this.listeners.delete(cb);
    };
  }

  private fadeVolumes(
    targetBgm: number,
    targetFire: number,
    durationMs: number,
    pauseWhenZero = false,
  ): void {
    if (this.fadeRafId !== null) {
      cancelAnimationFrame(this.fadeRafId);
      this.fadeRafId = null;
    }

    const bgm = this.bgm;
    const fire = this.fire;
    if (!bgm || !fire) return;

    const startBgm = bgm.volume;
    const startFire = fire.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / Math.max(1, durationMs));
      const eased = 1 - Math.pow(1 - t, 3);
      bgm.volume = Math.max(
        0,
        Math.min(1, startBgm + (targetBgm - startBgm) * eased),
      );
      fire.volume = Math.max(
        0,
        Math.min(1, startFire + (targetFire - startFire) * eased),
      );

      if (t < 1) {
        this.fadeRafId = requestAnimationFrame(step);
      } else {
        this.fadeRafId = null;
        if (pauseWhenZero && targetBgm === 0 && targetFire === 0) {
          bgm.pause();
          fire.pause();
        }
      }
    };

    this.fadeRafId = requestAnimationFrame(step);
  }

  private startAmbientLoops(): void {
    this.ensureAudioElements();
    if (!this.bgm || !this.fire || this.isMuted || document.hidden) return;

    const p1 = this.bgm.play().catch(() => {});
    const p2 = this.fire.play().catch(() => {});
    void Promise.all([p1, p2]).then(() => {
      if (!this.isMuted && !document.hidden) {
        this.fadeVolumes(
          BGM_TARGET_VOLUME,
          getFireTargetVolume(this.currentSection),
          900,
        );
      }
    });
  }

  /**
   * Unlocks Web Audio and begins fading in ambient BGM + fireplace crackle
   * after the visitor's first user gesture.
   */
  public unlockFromGesture(): void {
    this.ensureAudioElements();
    this.ensureAudioContext();

    if (!this.isUnlocked) {
      this.isUnlocked = true;
      this.notify();
    }

    if (!this.isMuted) {
      this.startAmbientLoops();
    }
  }

  public setSectionFocus(section: SectionId | null): void {
    this.currentSection = section;
    if (this.isUnlocked && !this.isMuted && !document.hidden) {
      this.fadeVolumes(BGM_TARGET_VOLUME, getFireTargetVolume(section), 700);
    }
  }

  public toggleMute(): void {
    this.ensureAudioElements();
    this.ensureAudioContext();

    if (!this.isUnlocked) {
      this.isUnlocked = true;
      this.isMuted = false;
      this.startAmbientLoops();
      this.playClickSound(true);
      this.notify();
      return;
    }

    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.fadeVolumes(0, 0, 260, true);
    } else {
      this.startAmbientLoops();
      this.playClickSound(true);
    }
    this.notify();
  }

  public handleVisibilityChange(): void {
    if (!this.bgm || !this.fire || !this.isUnlocked || this.isMuted) return;
    if (document.hidden) {
      this.fadeVolumes(0, 0, 200, true);
    } else {
      this.startAmbientLoops();
    }
  }

  public playClickSound(force = false): void {
    if (this.isMuted && !force) return;
    const now = performance.now();
    if (now - this.lastClickAt < 40) return;
    this.lastClickAt = now;

    const ctx = this.ensureAudioContext();
    if (ctx && this.clickBuffer && ctx.state === 'running') {
      const src = ctx.createBufferSource();
      src.buffer = this.clickBuffer;
      src.playbackRate.value = 0.96 + Math.random() * 0.08;

      const gain = ctx.createGain();
      gain.gain.value = CLICK_GAIN_VALUE;

      src.connect(gain);
      gain.connect(ctx.destination);
      src.start(0);
      return;
    }

    this.playFallbackClick();
  }
}

export const workshopAudio = new WorkshopAudioController();
