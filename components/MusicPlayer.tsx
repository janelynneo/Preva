import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { audioService } from "../services/audio";

const MUSIC_URL =
  "https://cdn.pixabay.com/audio/2022/10/25/audio_946bc3eb4c.mp3";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    audioService.initialize();
  }, []);

  const handleToggle = async () => {
    if (!isPlaying) {
      await audioService.loadMusic(MUSIC_URL);
      await audioService.play();
      setIsVisible(true);
    } else {
      await audioService.pause();
      await audioService.unloadMusic();
      setIsVisible(false);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isPlaying && styles.buttonActive]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>{isPlaying ? "🔊" : "🎵"}</Text>
        <Text style={styles.label}>
          {isPlaying ? "Pause Music" : "Play Soothing Music"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  buttonActive: {
    backgroundColor: "#0D3B3B",
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0D3B3B",
  },
});
