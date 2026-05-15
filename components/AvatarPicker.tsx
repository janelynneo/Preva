import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";

const AVATARS = [
  "🩵",
  "💪",
  "🧘‍♀️",
  "🏃",
  "🌿",
  "🌺",
  "⭐",
  "🦋",
  "🌙",
  "🔮",
  "🍀",
  "🎯",
];

interface AvatarPickerProps {
  visible: boolean;
  selected?: string;
  onSelect: (avatar: string) => void;
  onClose: () => void;
}

export default function AvatarPicker({
  visible,
  selected,
  onSelect,
  onClose,
}: AvatarPickerProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <Text style={styles.title}>Choose your avatar</Text>
          <View style={styles.grid}>
            {AVATARS.map((avatar) => (
              <TouchableOpacity
                key={avatar}
                style={[
                  styles.avatarButton,
                  selected === avatar && styles.avatarSelected,
                ]}
                onPress={() => {
                  onSelect(avatar);
                  onClose();
                }}
              >
                <Text style={styles.avatar}>{avatar}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: "85%",
    maxWidth: 340,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  avatarButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSelected: {
    backgroundColor: "#ede9fe",
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  avatar: {
    fontSize: 28,
  },
  cancelButton: {
    marginTop: 20,
    alignItems: "center",
    padding: 8,
  },
  cancelText: {
    color: "#94a3b8",
    fontSize: 16,
  },
});
