import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Linking,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { StorageService, UserProfile } from "../services/storage";
import {
  requestHealthKitAuthorization,
  refreshAuthorizationStatus,
  AuthorizationStatus,
} from "../services/health";

interface ProfileScreenProps {
  navigation?: any;
}

const AVATARS = ["🧑", "👩", "👨", "🧔", "👩‍🦰", "👨‍🦱", "👩‍🦳", "🧑‍🦲"];

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatar, setAvatar] = useState("🧑");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [wearableLoading, setWearableLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    morning: true,
    evening: true,
    weekly: false,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await StorageService.getProfile();
      if (data) {
        // Re-check auth status in case user toggled it in iOS Settings
        const authStatus = await refreshAuthorizationStatus();
        const updated = {
          ...data,
          wearableConnected: authStatus === "authorized",
        };
        await StorageService.saveProfile(updated);
        setProfile(updated);
        if (updated.avatar) setAvatar(updated.avatar);
      }
    } catch (error) {
      console.warn("ProfileScreen: failed to load profile", error);
      setProfile(null);
    }
  };

  const getAgeRange = (age: number): string => {
    const base = Math.floor(age / 5) * 5;
    return `${base}-${base + 4}`;
  };

  const getGoalLabels = (): string => {
    if (!profile) return "";
    // Determine goal based on user patterns (default to energy)
    return "⚡ Energy";
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL("https://metabo.health/privacy");
  };

  const handleDataExport = async () => {
    const checkIns = await StorageService.getCheckIns();
    const data = {
      profile,
      checkIns,
      exportedAt: new Date().toISOString(),
    };
    Alert.alert("Data Export", JSON.stringify(data, null, 2));
  };

  const handleWearableToggle = async (connect: boolean) => {
    if (!connect) {
      // Can't disconnect without going to iOS Settings
      return;
    }
    setWearableLoading(true);
    try {
      const status = await requestHealthKitAuthorization();
      if (profile) {
        const updated = {
          ...profile,
          wearableConnected: status === "authorized",
        };
        await StorageService.saveProfile(updated);
        setProfile(updated);
      }
    } catch {
      Alert.alert("Connection Failed", "Could not connect to Apple Watch.");
    } finally {
      setWearableLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all your data permanently. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: async () => {
            await StorageService.clearAll();
            navigation.navigate("Onboarding");
          },
        },
      ],
    );
  };

  // Calculate context completeness based on actual data
  const getContextScore = (): number => {
    if (!profile) return 0;
    let score = 30; // Base for completing profile
    if (profile.wearableConnected) score += 25;
    if (profile.familyHistoryT2D !== undefined) score += 15;
    // Add more as we track more data
    return Math.min(100, score);
  };

  const contextBreakdown = [
    { label: "Profile data", value: profile ? 100 : 0, icon: "👤" },
    { label: "Check-in history", value: 0, icon: "📝" },
    {
      label: "Wearable connected",
      value: profile?.wearableConnected ? 100 : 0,
      icon: "⌚",
    },
    {
      label: "Health context",
      value: profile?.familyHistoryT2D !== undefined ? 100 : 0,
      icon: "🏥",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.userInfo}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => setShowAvatarPicker(!showAvatarPicker)}
            >
              <Text style={styles.avatarText}>{avatar}</Text>
            </TouchableOpacity>
            {showAvatarPicker && (
              <View style={styles.avatarPicker}>
                {AVATARS.map((a) => (
                  <TouchableOpacity
                    key={a}
                    style={styles.avatarOption}
                    onPress={() => {
                      setAvatar(a);
                      setShowAvatarPicker(false);
                    }}
                  >
                    <Text style={{ fontSize: 28 }}>{a}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{profile?.name || "Not set"}</Text>
              <Text style={styles.userMeta}>
                {profile ? `${getAgeRange(profile.age)} years old` : ""} •{" "}
                {getGoalLabels()}
              </Text>
            </View>
          </View>
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Morning briefing</Text>
                <Text style={styles.settingDesc}>7:00 AM daily</Text>
              </View>
              <Switch
                value={notifications.morning}
                onValueChange={(val) =>
                  setNotifications({ ...notifications, morning: val })
                }
                trackColor={{ false: "#334d4d", true: "#6366f1" }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Evening check-in</Text>
                <Text style={styles.settingDesc}>8:00 PM daily</Text>
              </View>
              <Switch
                value={notifications.evening}
                onValueChange={(val) =>
                  setNotifications({ ...notifications, evening: val })
                }
                trackColor={{ false: "#334d4d", true: "#6366f1" }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Weekly summary</Text>
                <Text style={styles.settingDesc}>Every Sunday</Text>
              </View>
              <Switch
                value={notifications.weekly}
                onValueChange={(val) =>
                  setNotifications({ ...notifications, weekly: val })
                }
                trackColor={{ false: "#334d4d", true: "#6366f1" }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Data Sharing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sharing</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Wearable device</Text>
                <Text style={styles.settingDesc}>
                  {wearableLoading
                    ? "Connecting..."
                    : profile?.wearableConnected
                      ? "Connected"
                      : "Tap to connect Apple Watch"}
                </Text>
              </View>
              <Switch
                value={profile?.wearableConnected || false}
                onValueChange={(val) => handleWearableToggle(val)}
                trackColor={{ false: "#334d4d", true: "#6366f1" }}
                thumbColor="#fff"
                disabled={wearableLoading}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Blood test results</Text>
                <Text style={styles.settingDesc}>Lab results integration</Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: "#334d4d", true: "#6366f1" }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Context Completeness */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Context Completeness</Text>
          <View style={styles.card}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreValue}>{getContextScore()}%</Text>
              <Text style={styles.scoreLabel}>complete</Text>
            </View>
            <View style={styles.scoreBar}>
              <View
                style={[
                  styles.scoreBarFill,
                  { width: `${getContextScore()}%` },
                ]}
              />
            </View>
            <Text style={styles.scoreHint}>
              More context improves your MWI accuracy
            </Text>
            <View style={styles.contextBreakdown}>
              {contextBreakdown.map((item, index) => (
                <View key={index} style={styles.contextItem}>
                  <Text style={styles.contextIcon}>{item.icon}</Text>
                  <Text style={styles.contextLabel}>{item.label}</Text>
                  <View style={styles.contextBar}>
                    <View
                      style={[
                        styles.contextBarFill,
                        { width: `${item.value}%` },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Privacy & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Legal</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.linkRow}
              onPress={handlePrivacyPolicy}
            >
              <Text style={styles.linkText}>Privacy Policy</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.linkText}>Terms of Service</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.linkRow} onPress={handleDataExport}>
              <Text style={styles.linkText}>Data Export</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
              <Text style={styles.signOutText}>Sign Out & Clear Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This app is not a medical device. Consult your doctor for medical
            advice.
          </Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 8,
    marginHorizontal: 20,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 14,
    color: "#64748b",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 13,
    color: "#94a3b8",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },
  scoreHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0D3B3B",
    marginRight: 8,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#64748b",
  },
  scoreBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    marginBottom: 8,
  },
  scoreBarFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 4,
  },
  scoreHint: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 16,
  },
  contextBreakdown: {
    gap: 12,
  },
  contextItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contextIcon: {
    fontSize: 16,
    width: 28,
  },
  contextLabel: {
    fontSize: 14,
    color: "#64748b",
    width: 100,
  },
  contextBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
  },
  contextBarFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 3,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 16,
    color: "#1e293b",
  },
  linkArrow: {
    fontSize: 20,
    color: "#94a3b8",
  },
  avatarPicker: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    gap: 8,
    zIndex: 100,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarOption: {
    padding: 4,
  },
  signOutButton: {
    backgroundColor: "#fef2f2",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  disclaimer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  disclaimerText: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
  },
});
