import { Howl, Howler } from 'howler';
import { AUDIO_CONFIG, STORAGE_KEYS } from './constants';

class AudioManager {
  private currentTrack: Howl | null = null;
  private tracks: Map<string, Howl> = new Map();
  private volume: number = AUDIO_CONFIG.defaultVolume;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadSettings();
    }
  }

  private loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.audio);
      if (stored) {
        const settings = JSON.parse(stored);
        this.volume = settings.volume ?? AUDIO_CONFIG.defaultVolume;
        this.isMuted = settings.muted ?? false;
      }
    } catch (error) {
      console.error('Failed to load audio settings:', error);
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem(
        STORAGE_KEYS.audio,
        JSON.stringify({
          volume: this.volume,
          muted: this.isMuted,
        })
      );
    } catch (error) {
      console.error('Failed to save audio settings:', error);
    }
  }

  private getOrCreateTrack(src: string): Howl {
    if (this.tracks.has(src)) {
      return this.tracks.get(src)!;
    }

    const howl = new Howl({
      src: [src],
      html5: true,
      volume: this.isMuted ? 0 : this.volume,
      onend: () => {
        // Loop the track
        howl.play();
      },
    });

    this.tracks.set(src, howl);
    return howl;
  }

  async init() {
    if (this.isInitialized) return;
    
    // Unlock audio on user interaction
    Howler.autoUnlock = true;
    this.isInitialized = true;
  }

  play(trackName: string) {
    const src = AUDIO_CONFIG.tracks[trackName as keyof typeof AUDIO_CONFIG.tracks];
    if (!src) {
      console.warn(`Track "${trackName}" not found`);
      return;
    }

    const newTrack = this.getOrCreateTrack(src);

    if (this.currentTrack && this.currentTrack !== newTrack) {
      // Crossfade to new track
      this.crossfade(this.currentTrack, newTrack);
    } else if (!this.currentTrack) {
      // Just play the new track
      newTrack.play();
      this.currentTrack = newTrack;
    }
  }

  private crossfade(fromTrack: Howl, toTrack: Howl) {
    const fadeTime = AUDIO_CONFIG.fadeTime;
    const targetVolume = this.isMuted ? 0 : this.volume;

    // Fade out current track
    fromTrack.fade(fromTrack.volume(), 0, fadeTime);
    
    // Start new track at 0 volume and fade in
    toTrack.volume(0);
    toTrack.play();
    toTrack.fade(0, targetVolume, fadeTime);

    // Stop old track after fade
    setTimeout(() => {
      fromTrack.stop();
    }, fadeTime);

    this.currentTrack = toTrack;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (!this.isMuted) {
      Howler.volume(this.volume);
    }
    
    this.saveSettings();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    Howler.volume(this.isMuted ? 0 : this.volume);
    this.saveSettings();
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  getVolume() {
    return this.volume;
  }

  stop() {
    if (this.currentTrack) {
      this.currentTrack.fade(this.currentTrack.volume(), 0, AUDIO_CONFIG.fadeTime);
      setTimeout(() => {
        this.currentTrack?.stop();
      }, AUDIO_CONFIG.fadeTime);
    }
  }

  pause() {
    this.currentTrack?.pause();
  }

  resume() {
    this.currentTrack?.play();
  }
}

// Singleton instance
export const audioManager = new AudioManager();

