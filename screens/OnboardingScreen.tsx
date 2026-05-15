import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from "react-native";
import { StorageService, UserProfile } from "../services/storage";
import { requestHealthKitAuthorization } from "../services/health";

const TOTAL_STEPS = 4;

const ETHNICITIES = ["Chinese", "Malay", "Indian", "Others"];
const SEX_OPTIONS = ["Male", "Female"];

export default function OnboardingScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState(35);
  const [sex, setSex] = useState("");
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [ethnicity, setEthnicity] = useState("");
  const [familyHistory, setFamilyHistory] = useState("");
  const [wearableConnected, setWearableConnected] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const bmi = weight / Math.pow(height / 100, 2);
  const bmiCategory =
    bmi < 18.5
      ? "Underweight"
      : bmi < 25
        ? "Normal"
        : bmi < 30
          ? "Overweight"
          : "Obese";

  const canProceedStep1 = name.trim().length > 0;
  const canProceedStep2 = sex !== "";
  const canProceedStep3 = true; // height/weight have defaults, always can proceed
  const canProceedStep4 = consentChecked;

  async function handleNext() {
    if (showConsent) {
      const profile: UserProfile = {
        name,
        age,
        sex,
        height,
        weight,
        ethnicity,
        familyHistoryT2D: familyHistory === "yes",
        wearableConnected,
      };
      await StorageService.saveProfile(profile);
      const today = new Date().toISOString().split("T")[0];
      await StorageService.setSignupDate(today);
      navigation.navigate("HomeTabs");
    } else if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      setShowConsent(true);
    }
  }

  function handleSkipWearable() {
    setWearableConnected(false);
    setShowConsent(true);
  }

  async function handleConnectWearable() {
    try {
      await requestHealthKitAuthorization();
    } catch (err) {
      console.warn("HealthKit authorization failed:", err);
    }
    setWearableConnected(true);
    setShowConsent(true);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>
          Step {showConsent ? TOTAL_STEPS : step} of {TOTAL_STEPS}
        </Text>
        <Text style={styles.title}>
          {showConsent
            ? "One Last Thing"
            : step === 1
              ? "Your Name"
              : step === 2
                ? "The Basics"
                : step === 3
                  ? "Your Body"
                  : "Health Background"}
        </Text>
        <View style={styles.progress}>
          {Array(TOTAL_STEPS)
            .fill(false)
            .map((_, i) => i + 1)
            .map((s) => (
              <View
                key={s}
                style={[
                  styles.dot,
                  (showConsent || s <= step) && styles.dotActive,
                  s === step && styles.dotCurrent,
                ]}
              />
            ))}
        </View>
      </View>

      {/* Step 1: Name */}
      {!showConsent && step === 1 && (
        <View style={styles.card}>
          <Text style={styles.question}>What's your name?</Text>
          <Text style={styles.subtext}>
            So we can greet you personally each morning
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your name"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>
      )}

      {/* Step 2: The Basics - Age & Sex */}
      {!showConsent && step === 2 && (
        <View style={styles.card}>
          <Text style={styles.question}>How old are you?</Text>
          <Text style={styles.ageDisplay}>{age} years old</Text>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>25</Text>
            <View style={styles.sliderTrack}>
              <TouchableOpacity
                style={[
                  styles.sliderThumb,
                  { left: `${((age - 25) / 20) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.sliderLabel}>45</Text>
          </View>
          <View style={styles.sliderButtons}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => setAge(Math.max(25, age - 1))}
            >
              <Text style={styles.smallButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => setAge(Math.min(45, age + 1))}
            >
              <Text style={styles.smallButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.question, { marginTop: 24 }]}>
            What's your sex?
          </Text>
          <View style={styles.buttonRow}>
            {SEX_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.option, sex === option && styles.optionSelected]}
                onPress={() => setSex(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    sex === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Step 3: Your Body - Height, Weight, BMI */}
      {!showConsent && step === 3 && (
        <View style={styles.card}>
          <Text style={styles.question}>Height</Text>
          <Text style={styles.valueDisplay}>{height} cm</Text>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>150</Text>
            <View style={styles.sliderTrack}>
              <TouchableOpacity
                style={[
                  styles.sliderThumb,
                  { left: `${((height - 150) / 50) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.sliderLabel}>200</Text>
          </View>
          <View style={styles.sliderButtons}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => setHeight(Math.max(150, height - 1))}
            >
              <Text style={styles.smallButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => setHeight(Math.min(200, height + 1))}
            >
              <Text style={styles.smallButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.question, { marginTop: 24 }]}>Weight</Text>
          <Text style={styles.valueDisplay}>{weight} kg</Text>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>40</Text>
            <View style={styles.sliderTrack}>
              <TouchableOpacity
                style={[
                  styles.sliderThumb,
                  { left: `${((weight - 40) / 80) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.sliderLabel}>120</Text>
          </View>
          <View style={styles.sliderButtons}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => setWeight(Math.max(40, weight - 1))}
            >
              <Text style={styles.smallButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => setWeight(Math.min(120, weight + 1))}
            >
              <Text style={styles.smallButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bmiContainer}>
            <Text style={styles.bmiLabel}>Your BMI</Text>
            <Text style={styles.bmiValue}>{bmi.toFixed(1)}</Text>
            <Text
              style={[
                styles.bmiCategory,
                bmiCategory === "Normal" && styles.bmiNormal,
                (bmiCategory === "Overweight" || bmiCategory === "Obese") &&
                  styles.bmiWarning,
              ]}
            >
              {bmiCategory}
            </Text>
          </View>
        </View>
      )}

      {/* Step 4: Health Background */}
      {!showConsent && step === 4 && (
        <View style={styles.card}>
          <Text style={styles.question}>Ethnicity</Text>
          <View style={styles.buttonRow}>
            {ETHNICITIES.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  ethnicity === option && styles.optionSelected,
                ]}
                onPress={() => setEthnicity(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    ethnicity === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.question, { marginTop: 24 }]}>
            Family history of Type 2 Diabetes?
          </Text>
          <Text style={styles.subtext}>Optional — improves accuracy</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.option,
                familyHistory === "yes" && styles.optionSelected,
              ]}
              onPress={() => setFamilyHistory("yes")}
            >
              <Text
                style={[
                  styles.optionText,
                  familyHistory === "yes" && styles.optionTextSelected,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                familyHistory === "no" && styles.optionSelected,
              ]}
              onPress={() => setFamilyHistory("no")}
            >
              <Text
                style={[
                  styles.optionText,
                  familyHistory === "no" && styles.optionTextSelected,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Wearable Connection */}
      {!showConsent && step === TOTAL_STEPS && (
        <View style={styles.card}>
          <Text style={styles.question}>Connect Your Wearable</Text>
          <Text style={styles.subtext}>
            We'll only read your activity data. We never access messages,
            contacts, or location.
          </Text>

          <View style={styles.wearableList}>
            <View style={styles.wearableItem}>
              <Text style={styles.wearableIcon}>HRV</Text>
              <Text style={styles.wearableIcon}>⌚</Text>
              <View style={[styles.statusDot, styles.statusPending]} />
            </View>
            <View style={styles.wearableItem}>
              <Text style={styles.wearableIcon}>Sleep</Text>
              <Text style={styles.wearableIcon}>🌙</Text>
              <View style={[styles.statusDot, styles.statusPending]} />
            </View>
            <View style={styles.wearableItem}>
              <Text style={styles.wearableIcon}>Steps</Text>
              <Text style={styles.wearableIcon}>👟</Text>
              <View style={[styles.statusDot, styles.statusPending]} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleConnectWearable}
          >
            <Text style={styles.primaryButtonText}>Connect Wearable</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSkipWearable}
          >
            <Text style={styles.secondaryButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Consent Block */}
      {showConsent && (
        <View style={styles.card}>
          <Text style={styles.question}>Before We Begin</Text>

          <TouchableOpacity
            style={styles.consentRow}
            onPress={() => setConsentChecked(!consentChecked)}
          >
            <View
              style={[
                styles.checkbox,
                consentChecked && styles.checkboxChecked,
              ]}
            >
              {consentChecked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.consentText}>
              I understand how Metabo uses my data
            </Text>
          </TouchableOpacity>

          <View style={styles.consentPoints}>
            <Text style={styles.consentPoint}>
              Your wearable and self-reported data creates your Metabolic
              Wellness Index
            </Text>
            <Text style={styles.consentPoint}>
              Daily recommendations are generated from your baseline
            </Text>
            <Text style={styles.consentPoint}>
              You can delete your data anytime
            </Text>
          </View>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkButtonText}>View Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        {!showConsent && step < TOTAL_STEPS && (
          <TouchableOpacity
            style={[
              styles.button,
              (step === 1 && !canProceedStep1) ||
              (step === 2 && !canProceedStep2) ||
              (step === 3 && !canProceedStep3)
                ? styles.buttonDisabled
                : null,
            ]}
            onPress={handleNext}
            disabled={
              (step === 1 && !canProceedStep1) ||
              (step === 2 && !canProceedStep2) ||
              (step === 3 && !canProceedStep3)
            }
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        )}

        {showConsent && (
          <TouchableOpacity
            style={[styles.button, !consentChecked && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!consentChecked}
          >
            <Text style={styles.buttonText}>Start My Baseline</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.disclaimer}>
          This app is not a medical device. Consult your doctor for medical
          advice.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  stepIndicator: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  progress: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e2e8f0",
  },
  dotActive: {
    backgroundColor: "#6366f1",
  },
  dotCurrent: {
    width: 24,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  question: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1e293b",
    backgroundColor: "#f8fafc",
  },
  ageDisplay: {
    fontSize: 36,
    fontWeight: "700",
    color: "#6366f1",
    textAlign: "center",
    marginBottom: 8,
  },
  valueDisplay: {
    fontSize: 32,
    fontWeight: "700",
    color: "#6366f1",
    textAlign: "center",
    marginBottom: 8,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#94a3b8",
    width: 30,
    textAlign: "center",
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 2,
    marginHorizontal: 8,
    position: "relative",
  },
  sliderThumb: {
    position: "absolute",
    top: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#6366f1",
    marginLeft: -10,
  },
  sliderButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 8,
  },
  smallButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
  },
  smallButtonText: {
    fontSize: 24,
    color: "#6366f1",
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    minWidth: 80,
    alignItems: "center",
  },
  optionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#eef2ff",
  },
  optionText: {
    fontSize: 16,
    color: "#334155",
  },
  optionTextSelected: {
    color: "#6366f1",
    fontWeight: "600",
  },
  bmiContainer: {
    marginTop: 24,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
  },
  bmiLabel: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 4,
  },
  bmiValue: {
    fontSize: 40,
    fontWeight: "700",
    color: "#1e293b",
  },
  bmiCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94a3b8",
    marginTop: 4,
  },
  bmiNormal: {
    color: "#22c55e",
  },
  bmiWarning: {
    color: "#f59e0b",
  },
  wearableList: {
    marginVertical: 20,
  },
  wearableItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  wearableIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: "auto",
  },
  statusPending: {
    backgroundColor: "#e2e8f0",
  },
  statusConnected: {
    backgroundColor: "#22c55e",
  },
  primaryButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  consentText: {
    fontSize: 16,
    color: "#334155",
    flex: 1,
  },
  consentPoints: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  consentPoint: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
    paddingLeft: 16,
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  linkButtonText: {
    color: "#6366f1",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  footer: {
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#c7d2fe",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimer: {
    marginTop: 16,
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 18,
  },
});
