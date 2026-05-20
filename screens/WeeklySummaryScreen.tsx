import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StorageService, CheckIn, UserProfile } from "../services/storage";

interface MetricCardProps {
  title: string;
  value: string;
  status: "good" | "below" | "manageable";
  unit?: string;
}

function MetricCard({ title, value, status, unit }: MetricCardProps) {
  const statusColors = {
    good: "#22c55e",
    below: "#eab308",
    manageable: "#22c55e",
  };
  const statusLabels = {
    good: "Good",
    below: "Below",
    manageable: "Manageable",
  };

  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricTitle}>{title}</Text>
      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>{value}</Text>
        {unit && <Text style={styles.metricUnit}>{unit}</Text>}
      </View>
      <View style={styles.metricStatus}>
        <View
          style={[styles.statusDot, { backgroundColor: statusColors[status] }]}
        />
        <Text style={[styles.statusLabel, { color: statusColors[status] }]}>
          {statusLabels[status]}
        </Text>
      </View>
    </View>
  );
}

function getWeekRange(): { start: Date; end: Date; label: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-SG", { month: "short", day: "numeric" });
  return { start, end, label: `${fmt(start)} – ${fmt(end)}` };
}

export default function WeeklySummaryScreen({ navigation }: any) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [weekRange, setWeekRange] = useState(getWeekRange());
  const [weekNum, setWeekNum] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const profileData = await StorageService.getProfile();
      const checkInsData = await StorageService.getCheckIns();
      const signupDate = profileData
        ? await StorageService.getSignupDate()
        : null;

      let week = 1;
      if (signupDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const signup = new Date(signupDate);
        signup.setHours(0, 0, 0, 0);
        const days = Math.floor(
          (today.getTime() - signup.getTime()) / (1000 * 60 * 60 * 24),
        );
        week = Math.max(1, Math.floor((days - 1) / 7) + 1);
      }

      setProfile(profileData ?? null);
      setCheckIns(checkInsData ?? []);
      setWeekRange(getWeekRange());
      setWeekNum(week);
    } catch (error) {
      console.warn("WeeklySummary: failed to load data", error);
      setProfile(null);
      setCheckIns([]);
    }
  }

  // Calculate last 7 days of check-ins
  const last7Days = checkIns.slice(-7);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate averages
  const avgSleep = last7Days.length
    ? (
        last7Days.reduce((s, c) => s + c.sleepQuality, 0) / last7Days.length
      ).toFixed(1)
    : "—";
  const avgEnergy = last7Days.length
    ? (last7Days.reduce((s, c) => s + c.energy, 0) / last7Days.length).toFixed(
        1,
      )
    : "—";
  const avgStress = last7Days.length
    ? (last7Days.reduce((s, c) => s + c.stress, 0) / last7Days.length).toFixed(
        1,
      )
    : "—";
  const totalHawkerMeals = last7Days.reduce(
    (s, c) => s + (c.hawkerMeals || 0),
    0,
  );

  // Most common soreness
  const getMostCommonSoreness = (): string => {
    if (last7Days.length === 0) return "—";
    const counts: Record<string, number> = {
      None: 0,
      Mild: 0,
      Moderate: 0,
      Severe: 0,
    };
    last7Days.forEach((c) => {
      const s = c.soreness || "None";
      if (counts[s] !== undefined) counts[s]++;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0][1] > 0 ? sorted[0][0] : "—";
  };

  const mostCommonSoreness = getMostCommonSoreness();
  const sorenessStatus =
    mostCommonSoreness === "—"
      ? "good"
      : mostCommonSoreness === "None" || mostCommonSoreness === "Mild"
        ? "good"
        : mostCommonSoreness === "Moderate"
          ? "manageable"
          : "below";

  // Determine status for metrics
  const getSleepStatus = (): "good" | "below" | "manageable" => {
    const val = parseFloat(avgSleep as string);
    if (val >= 4) return "good";
    if (val >= 3) return "manageable";
    return "below";
  };

  const getEnergyStatus = (): "good" | "below" | "manageable" => {
    const val = parseFloat(avgEnergy as string);
    if (val >= 3.5) return "good";
    if (val >= 2.5) return "manageable";
    return "below";
  };

  const getStressStatus = (): "good" | "below" | "manageable" => {
    const val = parseFloat(avgStress as string);
    if (val <= 2) return "good";
    if (val <= 3.5) return "manageable";
    return "below";
  };

  // Generate insights based on data
  const getInsight = (): string => {
    if (last7Days.length === 0) {
      return "Start checking in daily to see personalized insights about your week.";
    }
    const messages: string[] = [];
    if (parseFloat(avgSleep as string) < 3) {
      messages.push(
        "Your sleep has been below optimal. Try going to bed 30 minutes earlier.",
      );
    }
    if (parseFloat(avgEnergy as string) < 3) {
      messages.push(
        "Your energy levels suggest you may benefit from more movement during the day.",
      );
    }
    if (parseFloat(avgStress as string) > 3.5) {
      messages.push(
        "High stress levels this week. Consider adding a short breathing exercise.",
      );
    }
    if (totalHawkerMeals > 10) {
      messages.push(
        "Many meals out this week. Balance with plenty of vegetables.",
      );
    }
    if (messages.length === 0) {
      messages.push("You're on track! Keep up the consistent check-ins.");
    }
    return messages.join(" ");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>YOUR WEEK IN REVIEW</Text>
        <Text style={styles.subtitle}>{weekRange.label}</Text>
        <Text style={styles.userInfo}>
          {profile?.name?.split(" ")[0] || "Your"}'s Week {weekNum}
        </Text>
      </View>

      <View style={styles.highlightCard}>
        <Text style={styles.highlightLabel}>YOUR HIGHLIGHT</Text>
        <Text style={styles.highlightText}>
          {last7Days.length} days tracked this week
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard
          title="Sleep"
          value={avgSleep}
          status={getSleepStatus()}
          unit="avg"
        />
        <MetricCard
          title="Energy"
          value={avgEnergy}
          status={getEnergyStatus()}
          unit="avg"
        />
        <MetricCard
          title="Stress"
          value={avgStress}
          status={getStressStatus()}
          unit="avg"
        />
        <MetricCard
          title="Healthy Meals"
          value={String(totalHawkerMeals)}
          status={totalHawkerMeals > 14 ? "below" : "good"}
        />
        <MetricCard
          title="Soreness"
          value={mostCommonSoreness}
          status={sorenessStatus}
        />
      </View>

      <View style={styles.insightsCard}>
        <Text style={styles.insightLabel}>INSIGHTS</Text>
        <Text style={styles.insightText}>{getInsight()}</Text>
      </View>

      <TouchableOpacity
        style={styles.mwiButton}
        onPress={() => navigation.navigate("MWI")}
      >
        <Text style={styles.mwiButtonText}>View My MWI</Text>
        <Text style={styles.mwiButtonArrow}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D3B3B",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#7dd3d3",
    marginTop: 8,
  },
  userInfo: {
    fontSize: 14,
    color: "#5bb8b8",
    marginTop: 4,
  },
  highlightCard: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  highlightLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0D3B3B",
    letterSpacing: 1,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  metricCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "47%",
    marginHorizontal: 4,
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  metricValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  metricValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
  },
  metricUnit: {
    fontSize: 14,
    color: "#94a3b8",
    marginLeft: 4,
  },
  metricStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  insightsCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5bb8b8",
    letterSpacing: 1,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 15,
    color: "#b8e0e0",
    lineHeight: 24,
  },
  mwiButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22c55e",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  mwiButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  mwiButtonArrow: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 8,
  },
});
