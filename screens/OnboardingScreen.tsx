import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { StorageService, UserProfile } from "../services/storage";
import { requestHealthKitAuthorization } from "../services/health";
import {
  requestNotificationPermissions,
  saveReminderConfig,
} from "../services/notifications";

const TOTAL_STEPS = 7;

const ETHNICITIES = ["Chinese", "Malay", "Indian", "Others"];
const SEX_OPTIONS = ["Male", "Female"];

export default function OnboardingScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const ageInputRef = useRef("");
  const heightInputRef = useRef("");
  const weightInputRef = useRef("");
  const [name, setName] = useState("");
  const [age, setAge] = useState(30);
  const [sex, setSex] = useState("");
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [ethnicity, setEthnicity] = useState("");
  const [familyHistoryT2D, setFamilyHistoryT2D] = useState<boolean | null>(
    null,
  );
  const [wearableConnected, setWearableConnected] = useState(false);
  const [wearableLoading, setWearableLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("20:00");
  const [consentChecked, setConsentChecked] = useState(false);

  const bmi = weight / Math.pow(height / 100, 2);
  const bmiCategory =
    bmi < 18.5
      ? "Underweight"
      : bmi < 25
        ? "Normal"
        : bmi < 30
          ? "Overweight"
          : "Obese";

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return name.trim().length > 0 && age > 0;
      case 2:
        return sex !== "";
      case 3:
        return true;
      case 4:
        return ethnicity !== "";
      case 5:
        return familyHistoryT2D !== null;
      case 6:
        return true;
      case 7:
        return consentChecked;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    console.log(
      "handleNext called, step:",
      step,
      "consentChecked:",
      consentChecked,
    );
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      const profile: UserProfile = {
        name,
        age,
        sex,
        height,
        weight,
        ethnicity,
        familyHistoryT2D: familyHistoryT2D ?? false,
        wearableConnected,
      };
      await StorageService.saveProfile(profile);
      const today = new Date().toISOString().split("T")[0];
      await StorageService.setSignupDate(today);

      // Persist notification preferences
      if (notificationsEnabled) {
        const [hourStr, minStr] = reminderTime.split(":");
        const hour = parseInt(hourStr ?? "20", 10);
        const minute = parseInt(minStr ?? "0", 10);
        await saveReminderConfig({
          enabled: true,
          time: "evening",
          customHour: hour,
        });
      }

      console.log("Profile saved, navigating to HomeTabs");
      // Replace the current route so user can't go back to onboarding
      navigation.replace("HomeTabs");
    }
  };

  const handleConnectWearable = async () => {
    setWearableLoading(true);
    try {
      const authorized = await requestHealthKitAuthorization();
      if (authorized) {
        setWearableConnected(true);
      } else {
        Alert.alert(
          "Apple Watch Not Connected",
          "You declined access to Apple Health. You can enable it later in Settings → Privacy → Health → Pulse.",
          [{ text: "OK" }],
        );
      }
    } catch (err) {
      console.warn("HealthKit authorization failed:", err);
      Alert.alert(
        "Connection Failed",
        "Could not connect to Apple Watch. Your baseline can still be built without wearable data.",
        [{ text: "OK" }],
      );
    } finally {
      setWearableLoading(false);
    }
  };

  const getStepTitle = (): string => {
    switch (step) {
      case 1:
        return "About You";
      case 2:
        return "Biological Sex";
      case 3:
        return "Body Measurements";
      case 4:
        return "Ethnicity";
      case 5:
        return "Family History";
      case 6:
        return "Wearables";
      case 7:
        return "Notifications";
      default:
        return "";
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <Text style={styles.stepIndicator}>
          Step {step} of {TOTAL_STEPS}
        </Text>
        <Text style={styles.title}>{getStepTitle()}</Text>
        <View style={styles.progress}>
          {Array(TOTAL_STEPS)
            .fill(false)
            .map((_, i) => i + 1)
            .map((s) => (
              <View
                key={s}
                style={[
                  styles.dot,
                  s <= step && styles.dotActive,
                  s === step && styles.dotCurrent,
                ]}
              />
            ))}
        </View>
      </View>

      {/* Step 1: Name + Age */}
      {step === 1 && (
        <View style={styles.card}>
          <Text style={styles.question}>What's your name?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your name"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={[styles.question, { marginTop: 24 }]}>Your age</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.numberInput}
              defaultValue={String(age)}
              onChangeText={(t) => {
                const val = parseInt(t, 10);
                if (!isNaN(val) && val >= 18 && val <= 100) setAge(val);
              }}
              keyboardType="numeric"
              maxLength={3}
            />
            <Text style={styles.unitLabel}>years old</Text>
          </View>
        </View>
      )}

      {/* Step 2: Sex */}
      {step === 2 && (
        <View style={styles.card}>
          <Text style={styles.question}>What's your sex?</Text>
          <Text style={styles.subtext}>
            This helps us personalize metabolic recommendations
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

      {/* Step 3: Height + Weight */}
      {step === 3 && (
        <View style={styles.card}>
          <Text style={styles.question}>Height</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.numberInput}
              defaultValue={String(height)}
              onChangeText={(t) => {
                const val = parseInt(t, 10);
                if (!isNaN(val) && val >= 100 && val <= 250) setHeight(val);
              }}
              keyboardType="numeric"
              maxLength={3}
            />
            <Text style={styles.unitLabel}>cm</Text>
          </View>

          <Text style={[styles.question, { marginTop: 24 }]}>Weight</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.numberInput}
              defaultValue={String(weight)}
              onChangeText={(t) => {
                const val = parseFloat(t);
                if (!isNaN(val) && val >= 30 && val <= 200) setWeight(val);
              }}
              keyboardType="decimal-pad"
              maxLength={5}
            />
            <Text style={styles.unitLabel}>kg</Text>
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

      {/* Step 4: Ethnicity */}
      {step === 4 && (
        <View style={styles.card}>
          <Text style={styles.question}>What's your ethnicity?</Text>
          <Text style={styles.subtext}>
            Metabolic health patterns vary across Asian populations — this helps
            personalise your recommendations
          </Text>
          <View style={styles.buttonColumn}>
            {ETHNICITIES.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionFull,
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
        </View>
      )}

      {/* Step 5: Family History T2D */}
      {step === 5 && (
        <View style={styles.card}>
          <Text style={styles.question}>
            Family history of Type 2 Diabetes?
          </Text>
          <Text style={styles.subtext}>
            This helps us assess your metabolic risk profile
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.option,
                familyHistoryT2D === true && styles.optionSelected,
              ]}
              onPress={() => setFamilyHistoryT2D(true)}
            >
              <Text
                style={[
                  styles.optionText,
                  familyHistoryT2D === true && styles.optionTextSelected,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.option,
                familyHistoryT2D === false && styles.optionSelected,
              ]}
              onPress={() => setFamilyHistoryT2D(false)}
            >
              <Text
                style={[
                  styles.optionText,
                  familyHistoryT2D === false && styles.optionTextSelected,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 6: Wearable */}
      {step === 6 && (
        <View style={styles.card}>
          <Text style={styles.question}>Connect Apple Watch</Text>
          <Text style={styles.subtext}>
            We'll read your HRV, sleep, and step data to personalize your MWI
          </Text>

          <View style={styles.wearableList}>
            {[
              {
                icon: "💓",
                label: "Heart Rate Variability",
                data: "Recovery scoring",
              },
              { icon: "🌙", label: "Sleep Data", data: "Baseline building" },
              { icon: "👟", label: "Step Count", data: "Team challenges" },
            ].map((item) => (
              <View key={item.label} style={styles.wearableItem}>
                <Text style={styles.wearableIcon}>{item.icon}</Text>
                <View style={styles.wearableInfo}>
                  <Text style={styles.wearableLabel}>{item.label}</Text>
                  <Text style={styles.wearableData}>{item.data}</Text>
                </View>
                <View
                  style={[
                    styles.statusDot,
                    wearableConnected
                      ? styles.statusConnected
                      : styles.statusPending,
                  ]}
                />
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              wearableConnected && styles.primaryButtonConnected,
              wearableLoading && styles.primaryButtonConnected,
            ]}
            onPress={wearableConnected ? () => {} : handleConnectWearable}
            disabled={wearableLoading}
          >
            <Text style={styles.primaryButtonText}>
              {wearableLoading
                ? "Connecting..."
                : wearableConnected
                  ? "✓ Connected"
                  : "Connect Apple Watch"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setStep(step + 1)}
          >
            <Text style={styles.secondaryButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 7: Notifications */}
      {step === 7 && (
        <View style={styles.card}>
          <Text style={styles.question}>Stay on Track</Text>
          <Text style={styles.subtext}>
            We'll send you daily reminders to check in
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Daily check-in reminder</Text>
              {notificationsEnabled && (
                <Text style={styles.settingDesc}>Tap to change time</Text>
              )}
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={async (value) => {
                if (value) {
                  const granted = await requestNotificationPermissions();
                  if (!granted) {
                    Alert.alert(
                      "Notifications Disabled",
                      "Enable notifications in Settings → Pulse → Notifications to receive daily reminders.",
                      [{ text: "OK" }],
                    );
                    return;
                  }
                }
                setNotificationsEnabled(value);
              }}
              trackColor={{ false: "#334d4d", true: "#6366f1" }}
              thumbColor="#fff"
            />
          </View>
          {notificationsEnabled && (
            <View style={styles.timeInputRow}>
              <TextInput
                style={styles.timeInput}
                value={reminderTime}
                onChangeText={setReminderTime}
                keyboardType="default"
                maxLength={5}
                placeholder="HH:MM"
                placeholderTextColor="#94a3b8"
              />
              <Text style={styles.timeHint}>24-hour format e.g. 20:00</Text>
            </View>
          )}

          <View style={styles.consentSection}>
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
                I understand how my data is used
              </Text>
            </TouchableOpacity>

            <View style={styles.consentPoints}>
              <Text style={styles.consentPoint}>
                • Your data creates your personal MWI
              </Text>
              <Text style={styles.consentPoint}>
                • All data stored locally on your device
              </Text>
              <Text style={styles.consentPoint}>
                • You can delete data anytime
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !canProceed() && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.buttonText}>
            {step < TOTAL_STEPS ? "Continue" : "Start My Baseline"}
          </Text>
        </TouchableOpacity>

        {step > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.backText}>← Back</Text>
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
    fontSize: 48,
    fontWeight: "700",
    color: "#6366f1",
    textAlign: "center",
    marginBottom: 8,
  },
  valueDisplay: {
    fontSize: 36,
    fontWeight: "700",
    color: "#6366f1",
    textAlign: "center",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  numberInput: {
    borderWidth: 1.5,
    borderColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    backgroundColor: "#f8fafc",
    minWidth: 100,
    textAlign: "center",
  },
  unitLabel: {
    fontSize: 18,
    color: "#64748b",
    fontWeight: "500",
  },
  timeInputRow: {
    marginTop: 8,
    marginBottom: 8,
  },
  timeInput: {
    borderWidth: 1.5,
    borderColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    backgroundColor: "#f8fafc",
    width: 120,
    textAlign: "center",
  },
  timeHint: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
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
    gap: 12,
  },
  buttonColumn: {
    gap: 12,
  },
  option: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  optionFull: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
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
    marginVertical: 16,
  },
  wearableItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  wearableIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  wearableInfo: {
    flex: 1,
  },
  wearableLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
  },
  wearableData: {
    fontSize: 13,
    color: "#94a3b8",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
  primaryButtonConnected: {
    backgroundColor: "#22c55e",
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: "#1e293b",
  },
  settingDesc: {
    fontSize: 13,
    color: "#94a3b8",
  },
  consentSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 16,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  },
  consentPoint: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 6,
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
  backButton: {
    marginTop: 16,
    padding: 8,
  },
  backText: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "500",
  },
  disclaimer: {
    marginTop: 16,
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 18,
  },
});
