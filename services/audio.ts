import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";

class AudioService {
  private sound: Audio.Sound | null = null;
  private isLoaded = false;

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: InterruptionModeIOS.DuckOthers,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      });
    } catch (error) {
      console.error("Failed to set audio mode:", error);
    }
  }

  async loadMusic(uri: string) {
    if (this.sound) {
      await this.unloadMusic();
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false, isLooping: true, volume: 0.3 },
      );
      this.sound = sound;
      this.isLoaded = true;
    } catch (error) {
      console.error("Failed to load music:", error);
      this.isLoaded = false;
    }
  }

  async play() {
    if (this.sound && this.isLoaded) {
      try {
        await this.sound.playAsync();
      } catch (error) {
        console.error("Failed to play music:", error);
      }
    }
  }

  async pause() {
    if (this.sound && this.isLoaded) {
      try {
        await this.sound.pauseAsync();
      } catch (error) {
        console.error("Failed to pause music:", error);
      }
    }
  }

  async setVolume(volume: number) {
    if (this.sound && this.isLoaded) {
      try {
        await this.sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
      } catch (error) {
        console.error("Failed to set volume:", error);
      }
    }
  }

  async toggle() {
    if (this.sound && this.isLoaded) {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await this.pause();
        return false;
      } else {
        await this.play();
        return true;
      }
    }
    return false;
  }

  async isPlaying(): Promise<boolean> {
    if (this.sound && this.isLoaded) {
      const status = await this.sound.getStatusAsync();
      return status.isLoaded && status.isPlaying;
    }
    return false;
  }

  async unloadMusic() {
    if (this.sound) {
      try {
        await this.sound.unloadAsync();
      } catch (error) {
        console.error("Failed to unload music:", error);
      }
      this.sound = null;
      this.isLoaded = false;
    }
  }
}

export const audioService = new AudioService();
