import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { StorageService } from "../services/storage";
import { resetReEngagementTracking } from "../services/notifications";

interface CheckInScreenProps {
  navigation?: any;
}

export default function CheckInScreen({ navigation }: CheckInScreenProps) {
  const [step, setStep] = useState(1);
  const [sleepQuality, setSleepQuality] = useState(0);
  const [soreness, setSoreness] = useState<string | null>(null);
  const [energyLevel, setEnergyLevel] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [hawkerMeals, setHawkerMeals] = useState(1);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadStreak();
  }, []);

  const loadStreak = async () => {
    const currentStreak = await StorageService.getStreak();
    setStreak(currentStreak);
  };

  const updateStreak = async () => {
    const today = new Date().toISOString().split("T")[0];
    const lastCheckInDate = await StorageService.getLastCheckInDate();
    let newStreak = streak;

    if (lastCheckInDate) {
      const lastDate = new Date(lastCheckInDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 0) {
        // Same day — streak unchanged
        return;
      } else if (diffDays === 1) {
        newStreak = streak + 1;
      } else {
        // Missed a day or more — reset
        newStreak = 1;
      }
    } else {
      // First ever check-in
      newStreak = 1;
    }

    await StorageService.saveStreak(newStreak);
    setStreak(newStreak);
  };

  const totalSteps = 6;
  const canProceed =
    (step === 1 && sleepQuality > 0) ||
    (step === 2 && energyLevel > 0) ||
    (step === 3 && soreness !== null) ||
    (step === 4 && stressLevel > 0) ||
    step === 5 ||
    step === 6; // photo is optional

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const checkIn = {
        date: today,
        sleepQuality,
        energy: energyLevel,
        stress: stressLevel,
        soreness: soreness || "None",
        hawkerMeals,
        notes: "",
      };
      await StorageService.saveCheckIn(checkIn);
      await updateStreak();
      // Reset re-engagement tracking so stale-user hooks don't fire
      resetReEngagementTracking().catch(console.warn);
      setSubmitted(true);
    } catch (err) {
      Alert.alert("Error", "Failed to save check-in. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDone = () => {
    // Navigate to HomeTabs and switch to Home tab
    // Since CheckInScreen is inside Tab.Navigator, we need to go up to Stack then to HomeTabs
    const parent = navigation?.getParent?.();
    if (parent) {
      parent.navigate("HomeTabs");
    } else {
      navigation?.navigate("HomeTabs");
    }
  };

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Photo access lets you log your hawker meals visually.",
        [{ text: "OK" }],
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Camera permission needed",
        "Enable camera access in Settings to snap your meal.",
        [{ text: "OK" }],
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const clearPhoto = () => setPhotoUri(null);

  // Render star rating
  const renderStars = (
    max: number,
    current: number,
    onSelect: (n: number) => void,
  ) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity
          key={n}
          onPress={() => onSelect(n)}
          style={styles.starButton}
        >
          <Text style={[styles.star, n <= current && styles.starFilled]}>
            {n <= current ? "★" : "☆"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render dot rating
  const renderDots = (
    max: number,
    current: number,
    onSelect: (n: number) => void,
  ) => (
    <View style={styles.dotsContainer}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity
          key={n}
          onPress={() => onSelect(n)}
          style={[styles.dot, n <= current && styles.dotFilled]}
        />
      ))}
    </View>
  );

  if (submitted) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successTitle}>Check-in Complete!</Text>
          <View style={styles.streakCard}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>{streak} day streak!</Text>
          </View>
          <Text style={styles.personalizedMessage}>
            Based on your check-in, we recommend an early night tonight. Your
            energy levels suggest you could benefit from extra recovery time.
          </Text>
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Evening Check-In</Text>
          <Text style={styles.subtitle}>
            Question {step} of {totalSteps}
          </Text>
          <View style={styles.progress}>
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <View
                key={s}
                style={[
                  styles.progressDot,
                  s <= step && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Step 1: Sleep Quality - Emoji Scale */}
        {step === 1 && (
          <View style={styles.questionCard}>
            <Text style={styles.question}>How refreshed do you feel?</Text>
            <Text style={styles.questionHint}>Last night's sleep impact</Text>
            <View style={styles.emojiRow}>
              {[
                { val: 1, emoji: "😴" },
                { val: 2, emoji: "😔" },
                { val: 3, emoji: "😐" },
                { val: 4, emoji: "😊" },
                { val: 5, emoji: "🔥" },
              ].map(({ val, emoji }) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.emojiButton,
                    sleepQuality === val && styles.emojiButtonSelected,
                  ]}
                  onPress={() => setSleepQuality(val)}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Energy - Singapore Context */}
        {step === 2 && (
          <View style={styles.questionCard}>
            <Text style={styles.question}>Did you beat the 3pm slump?</Text>
            <Text style={styles.questionHint}>
              That 2-3pm window when work hits hard
            </Text>
            <View style={styles.emojiRow}>
              {[
                { val: 1, emoji: "😫" },
                { val: 2, emoji: "😩" },
                { val: 3, emoji: "😐" },
                { val: 4, emoji: "💪" },
                { val: 5, emoji: "🚀" },
              ].map(({ val, emoji }) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.emojiButton,
                    energyLevel === val && styles.emojiButtonSelected,
                  ]}
                  onPress={() => setEnergyLevel(val)}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Soreness */}
        {step === 3 && (
          <View style={styles.questionCard}>
            <Text style={styles.question}>Any muscle soreness today?</Text>
            <Text style={styles.questionHint}>From desk work or activity</Text>
            <View style={styles.sorenessButtons}>
              {["None", "Mild", "Moderate", "Severe"].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.sorenessButton,
                    soreness === level && styles.sorenessButtonSelected,
                  ]}
                  onPress={() => setSoreness(level)}
                >
                  <Text
                    style={[
                      styles.sorenessButtonText,
                      soreness === level && styles.sorenessButtonTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 4: Stress Level */}
        {step === 4 && (
          <View style={styles.questionCard}>
            <Text style={styles.question}>How's your stress level?</Text>
            <Text style={styles.questionHint}>
              Work deadline + MRT crowd + life
            </Text>
            <View style={styles.emojiRow}>
              {[
                { val: 1, emoji: "😌" },
                { val: 2, emoji: "😟" },
                { val: 3, emoji: "😰" },
                { val: 4, emoji: "😫" },
                { val: 5, emoji: "🤯" },
              ].map(({ val, emoji }) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.emojiButton,
                    stressLevel === val && styles.emojiButtonSelected,
                  ]}
                  onPress={() => setStressLevel(val)}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 5: Hawker Meals */}
        {step === 5 && (
          <View style={styles.questionCard}>
            <Text style={styles.question}>Hawker meals today?</Text>
            <Text style={styles.questionHint}>
              How many hawker center meals did you have?
            </Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => setHawkerMeals(Math.max(0, hawkerMeals - 1))}
              >
                <Text style={styles.stepperButtonText}>−</Text>
              </TouchableOpacity>
              <View style={styles.stepperValue}>
                <Text style={styles.stepperValueText}>{hawkerMeals}</Text>
              </View>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => setHawkerMeals(hawkerMeals + 1)}
              >
                <Text style={styles.stepperButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Photo attachment */}
            <View style={styles.photoSection}>
              {photoUri ? (
                <View style={styles.photoPreview}>
                  <Image source={{ uri: photoUri }} style={styles.photoThumb} />
                  <TouchableOpacity
                    style={styles.photoRemove}
                    onPress={clearPhoto}
                  >
                    <Text style={styles.photoRemoveText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.photoButtons}>
                  <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
                    <Text style={styles.photoBtnIcon}>📷</Text>
                    <Text style={styles.photoBtnText}>Snap meal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.photoBtn} onPress={pickPhoto}>
                    <Text style={styles.photoBtnIcon}>🖼️</Text>
                    <Text style={styles.photoBtnText}>Choose photo</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.photoHint}>
                {photoUri
                  ? "Photo attached — tap ✕ to remove"
                  : "Optional: attach a photo of your hawker meal"}
              </Text>
            </View>
          </View>
        )}

        {/* Step 6: Confirm */}
        {step === 6 && (
          <View style={styles.questionCard}>
            <Text style={styles.question}>All done?</Text>
            <Text style={styles.questionHint}>
              Your check-in is ready to submit.
            </Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sleep</Text>
              <Text style={styles.summaryEmoji}>
                {sleepQuality === 1
                  ? "😴"
                  : sleepQuality === 2
                    ? "😔"
                    : sleepQuality === 3
                      ? "😐"
                      : sleepQuality === 4
                        ? "😊"
                        : "🔥"}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Energy</Text>
              <Text style={styles.summaryEmoji}>
                {energyLevel === 1
                  ? "😫"
                  : energyLevel === 2
                    ? "😩"
                    : energyLevel === 3
                      ? "😐"
                      : energyLevel === 4
                        ? "💪"
                        : "🚀"}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Stress</Text>
              <Text style={styles.summaryEmoji}>
                {stressLevel === 1
                  ? "😌"
                  : stressLevel === 2
                    ? "😟"
                    : stressLevel === 3
                      ? "😰"
                      : stressLevel === 4
                        ? "😫"
                        : "🤯"}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Soreness</Text>
              <Text style={styles.summaryValue}>{soreness}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Hawker meals</Text>
              <Text style={styles.summaryValue}>{hawkerMeals}</Text>
            </View>
            {photoUri && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Photo</Text>
                <Text style={styles.summaryValue}>📷 attached</Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              (!canProceed || saving) && styles.buttonDisabled,
            ]}
            onPress={handleNext}
            disabled={!canProceed || saving}
          >
            <Text style={styles.buttonText}>
              {saving ? "Saving..." : step < totalSteps ? "Continue" : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D3B3B",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 16,
  },
  progress: {
    flexDirection: "row",
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#334d4d",
  },
  progressDotActive: {
    backgroundColor: "#6366f1",
  },
  questionCard: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },
  question: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  questionHint: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 40,
    color: "#e2e8f0",
  },
  starFilled: {
    color: "#eab308",
  },
  sorenessButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sorenessButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  sorenessButtonSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#eef2ff",
  },
  sorenessButtonText: {
    fontSize: 15,
    color: "#334155",
  },
  sorenessButtonTextSelected: {
    color: "#6366f1",
    fontWeight: "600",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
  },
  dotFilled: {
    backgroundColor: "#6366f1",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  stepperButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0D3B3B",
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "500",
  },
  stepperValue: {
    minWidth: 60,
    alignItems: "center",
  },
  stepperValueText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1e293b",
  },
  footer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#4f46e5",
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  successContainer: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 24,
  },
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: 24,
  },
  streakIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  streakText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#92400e",
  },
  personalizedMessage: {
    fontSize: 16,
    color: "#e2e8f0",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  doneButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Photo
  photoSection: {
    marginTop: 20,
    alignItems: "center",
  },
  photoButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  photoBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  photoBtnIcon: { fontSize: 18 },
  photoBtnText: { fontSize: 13, color: "#334155", fontWeight: "500" },
  photoPreview: {
    position: "relative",
    marginBottom: 8,
  },
  photoThumb: {
    width: 120,
    height: 90,
    borderRadius: 10,
  },
  photoRemove: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ef4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  photoRemoveText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  photoHint: { fontSize: 12, color: "#94a3b8", textAlign: "center" },

  // Summary
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  summaryLabel: { fontSize: 14, color: "#64748b" },
  summaryStars: { fontSize: 14, color: "#eab308" },
  summaryValue: { fontSize: 14, color: "#1e293b", fontWeight: "500" },
  summaryEmoji: { fontSize: 20 },

  // Emoji scale buttons
  emojiRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  emojiButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  emojiButtonSelected: {
    backgroundColor: "#eef2ff",
    borderColor: "#6366f1",
  },
  emoji: {
    fontSize: 28,
  },
});
