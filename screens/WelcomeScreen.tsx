import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { StorageService } from "../services/storage";
import { TeamService } from "../services/team";
import { getDailyInsight, getDailyQuote } from "../services/insights";
import { CheckIn, UserProfile } from "../services/storage";

const { width } = Dimensions.get("window");
const BASELINE_DAYS = 28;

function getWeekRange(): { label: string } {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-SG", { month: "short", day: "numeric" });
  return { label: `${fmt(start)} – ${fmt(now)}` };
}

export default function WelcomeScreen({ navigation }: { navigation: any }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [streak, setStreak] = useState(0);
  const [daysSinceSignup, setDaysSinceSignup] = useState(0);
  const [team, setTeam] = useState<any>(null);
  const [teamProgress, setTeamProgress] = useState({
    current: 0,
    goal: 0,
    percent: 0,
  });
  const [dailyInsight, setDailyInsight] = useState("");
  const [quote, setQuote] = useState("");
  const [weekRange, setWeekRange] = useState(getWeekRange());

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const profileData = await StorageService.getProfile();
    const checkInsData = await StorageService.getCheckIns();
    const streakData = await StorageService.getStreak();
    let days = await StorageService.getDaysSinceSignup();
    // Calculate days from signup date if not already stored
    if (days === 0) {
      const signupDate = await StorageService.getSignupDate();
      if (signupDate) {
        const signup = new Date(signupDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        signup.setHours(0, 0, 0, 0);
        days = Math.floor(
          (today.getTime() - signup.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (days > 0) {
          await StorageService.saveStreak(days);
        }
      }
    }
    const teamData = await TeamService.getTeam();
    const progress = await TeamService.getTeamProgress();

    setProfile(profileData);
    setCheckIns(checkInsData);
    setStreak(streakData);
    setDaysSinceSignup(days);
    setTeam(teamData);
    setTeamProgress(progress);

    if (profileData) {
      const insight = getDailyInsight({
        ethnicity: profileData.ethnicity,
        familyHistoryT2D: profileData.familyHistoryT2D,
        wearableConnected: profileData.wearableConnected,
        recentCheckIns: checkInsData,
        daysSinceSignup: days,
      });
      setDailyInsight(insight);
    }

    setQuote(getDailyQuote());
    setWeekRange(getWeekRange());
  }

  const isOnboarded = profile !== null;
  const name = profile?.name?.split(" ")[0] || "";
  const weekNum = Math.ceil(Math.max(1, daysSinceSignup) / 7);
  const isBaseline = daysSinceSignup > 0 && daysSinceSignup <= BASELINE_DAYS;
  const daysLeft = Math.max(0, BASELINE_DAYS - daysSinceSignup);

  // Compute last-7-days averages
  const recent = checkIns.slice(-7);
  const avgSleep = recent.length
    ? Math.round(
        (recent.reduce((s, c) => s + c.sleepQuality, 0) / recent.length) * 10,
      ) / 10
    : 0;
  const avgEnergy = recent.length
    ? Math.round(
        (recent.reduce((s, c) => s + c.energy, 0) / recent.length) * 10,
      ) / 10
    : 0;
  const avgStress = recent.length
    ? Math.round(
        (recent.reduce((s, c) => s + c.stress, 0) / recent.length) * 10,
      ) / 10
    : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // ─── FIRST-TIME USER ───────────────────────────────────────────────────
  if (!isOnboarded) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroSection}>
            <Text style={styles.logo}>Metabo</Text>
            <Text style={styles.tagline}>
              Your daily metabolic wellness companion for Singapore desk workers
            </Text>
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroCardTitle}>What's your MWI?</Text>
            <Text style={styles.heroCardSub}>
              The Metabolic Wellness Index is your personal score — tracking
              sleep, recovery, activity, and hawker habits to paint a picture of
              your metabolic health.
            </Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>85%</Text>
                <Text style={styles.heroStatLabel}>Sleep</Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>+12%</Text>
                <Text style={styles.heroStatLabel}>Recovery</Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>8,200</Text>
                <Text style={styles.heroStatLabel}>Steps</Text>
              </View>
            </View>
          </View>

          <View style={styles.howItWorks}>
            <Text style={styles.sectionTitle}>How it works</Text>
            {[
              {
                icon: "📝",
                text: "Daily check-ins — 30 seconds to log sleep, energy, stress",
              },
              {
                icon: "📊",
                text: "Build your baseline — 28 days of data creates your personal MWI",
              },
              {
                icon: "🎯",
                text: "Personalised tips based on your patterns and ethnicity",
              },
              {
                icon: "🤝",
                text: "Team challenges — hit collective goals with friends",
              },
            ].map((item, i) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={styles.bulletIcon}>{item.icon}</Text>
                <Text style={styles.bulletText}>{item.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>Why track with Metabo?</Text>
            {[
              "Understand how Singapore's hawker culture affects your energy",
              "See how sleep quality connects to your daily performance",
              "T2D prevention — early patterns your doctor won't catch",
              "Compete with friends in a team step challenge",
            ].map((b, i) => (
              <Text key={i} style={styles.benefitItem}>
                • {b}
              </Text>
            ))}
          </View>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate("Onboarding")}
          >
            <Text style={styles.ctaButtonText}>Start My Baseline</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            PDPA-compliant • All data stored locally on your device
          </Text>
        </ScrollView>
      </View>
    );
  }

  // ─── RETURNING USER ────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greeting}>
                {getGreeting()}, {name}!
              </Text>
              <Text style={styles.dayCounter}>
                Day {daysSinceSignup} of {BASELINE_DAYS} baseline
                {isBaseline && daysLeft > 0 ? ` · ${daysLeft} days to go` : ""}
              </Text>
            </View>
            {streak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <Text style={styles.streakNum}>{streak}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Week at a Glance */}
        <Text style={styles.sectionLabel}>THIS WEEK</Text>
        <View style={styles.weekCard}>
          <View style={styles.weekHeader}>
            <Text style={styles.weekTitle}>Week {weekNum} Summary</Text>
            <Text style={styles.weekRange}>{weekRange.label}</Text>
          </View>
          <View style={styles.weekStats}>
            <View style={styles.weekStat}>
              <Text style={styles.weekStatValue}>{avgSleep.toFixed(1)}</Text>
              <Text style={styles.weekStatLabel}>Sleep /5</Text>
            </View>
            <View style={styles.weekStatDivider} />
            <View style={styles.weekStat}>
              <Text style={styles.weekStatValue}>{avgEnergy.toFixed(1)}</Text>
              <Text style={styles.weekStatLabel}>Energy /5</Text>
            </View>
            <View style={styles.weekStatDivider} />
            <View style={styles.weekStat}>
              <Text style={styles.weekStatValue}>{avgStress.toFixed(1)}</Text>
              <Text style={styles.weekStatLabel}>Stress /5</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.weekSummaryLink}
            onPress={() => navigation.navigate("WeeklySummary")}
          >
            <Text style={styles.weekSummaryLinkText}>
              View full weekly summary →
            </Text>
          </TouchableOpacity>
        </View>

        {/* MWI Banner */}
        {isBaseline ? (
          <TouchableOpacity
            style={styles.baselineCard}
            onPress={() => navigation.navigate("CheckIn")}
          >
            <Text style={styles.baselineLabel}>BASELINE BUILDING</Text>
            <Text style={styles.baselineTitle}>Keep checking in daily</Text>
            <Text style={styles.baselineSub}>
              {recent.length}/7 days logged this week. Consistency builds a
              meaningful MWI.
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.mwiBanner}
            onPress={() => navigation.navigate("MWI")}
          >
            <Text style={styles.mwiBannerLabel}>
              MY METABOLIC WELLNESS INDEX
            </Text>
            <View style={styles.mwiRow}>
              <Text style={styles.mwiPercent}>—</Text>
              <View style={styles.mwiMeta}>
                <Text style={styles.mwiSub}>
                  Based on {daysSinceSignup} days of data
                </Text>
                <Text style={styles.mwiCta}>View my MWI →</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Personalised Insight */}
        {dailyInsight ? (
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>TODAY'S INSIGHT</Text>
            <Text style={styles.insightText}>{dailyInsight}</Text>
          </View>
        ) : null}

        {/* Team Challenge */}
        <Text style={styles.sectionLabel}>TEAM CHALLENGE</Text>
        {team ? (
          <View style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <Text style={styles.teamName}>{team.name}</Text>
              <View style={styles.teamProgressPill}>
                <Text style={styles.teamProgressText}>
                  {teamProgress.current.toLocaleString()} /{" "}
                  {(teamProgress.goal / 1000).toLocaleString()}K
                </Text>
              </View>
            </View>
            <View style={styles.teamBar}>
              <View
                style={[
                  styles.teamBarFill,
                  { width: `${teamProgress.percent}%` },
                ]}
              />
            </View>
            <Text style={styles.teamPercent}>
              {teamProgress.percent}% of goal
            </Text>
            <View style={styles.teamMembers}>
              {team.members.slice(0, 4).map((m: any, i: number) => (
                <View key={i} style={styles.teamMember}>
                  <Text style={styles.teamMemberAvatar}>
                    {m.avatar || "👤"}
                  </Text>
                  <Text style={styles.teamMemberName} numberOfLines={1}>
                    {m.name}
                  </Text>
                  <Text style={styles.teamMemberSteps}>
                    {m.steps.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.teamEmptyCard}>
            <Text style={styles.teamEmptyTitle}>Start a team challenge</Text>
            <Text style={styles.teamEmptySub}>
              Hit collective goals with friends — walking, hawker choices,
              check-in streaks
            </Text>
            <View style={styles.teamEmptyButtons}>
              <TouchableOpacity
                style={styles.teamCreateBtn}
                onPress={() => navigation.navigate("CreateTeam")}
              >
                <Text style={styles.teamCreateBtnText}>Create Team</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.teamJoinBtn}
                onPress={() => navigation.navigate("JoinTeam")}
              >
                <Text style={styles.teamJoinBtnText}>Join with Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>"{quote}"</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => navigation.navigate("CheckIn")}
          >
            <Text style={styles.primaryActionText}>Morning Briefing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => navigation.navigate("Coach")}
          >
            <Text style={styles.secondaryActionText}>Ask Coach</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { paddingBottom: 100 },

  // ── First-time user ──────────────────────────────
  heroSection: { paddingTop: 80, paddingHorizontal: 24, alignItems: "center" },
  logo: { fontSize: 40, fontWeight: "800", color: "#0D3B3B", marginBottom: 12 },
  tagline: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
  },
  heroCard: {
    marginHorizontal: 20,
    marginTop: 32,
    backgroundColor: "#0D3B3B",
    borderRadius: 20,
    padding: 24,
  },
  heroCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 8,
  },
  heroCardSub: {
    fontSize: 14,
    color: "#cbd5e1",
    lineHeight: 22,
    marginBottom: 20,
  },
  heroStats: { flexDirection: "row", justifyContent: "space-around" },
  heroStat: { alignItems: "center" },
  heroStatValue: { fontSize: 24, fontWeight: "700", color: "#fff" },
  heroStatLabel: { fontSize: 12, color: "#94a3b8", marginTop: 4 },
  howItWorks: { marginTop: 32, marginHorizontal: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  bulletItem: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  bulletIcon: { fontSize: 20, width: 32 },
  bulletText: { fontSize: 15, color: "#475569", flex: 1, lineHeight: 22 },
  benefitsCard: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: "#faf3e0",
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#92400e",
    marginBottom: 12,
  },
  benefitItem: {
    fontSize: 14,
    color: "#78350f",
    lineHeight: 22,
    marginBottom: 4,
  },
  ctaButton: {
    marginHorizontal: 20,
    marginTop: 32,
    backgroundColor: "#6366f1",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  ctaButtonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  disclaimer: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 20,
  },

  // ── Returning user ───────────────────────────────
  header: { paddingTop: 70, paddingHorizontal: 20, paddingBottom: 16 },
  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: { fontSize: 26, fontWeight: "700", color: "#1e293b" },
  dayCounter: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakEmoji: { fontSize: 16 },
  streakNum: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400e",
    marginLeft: 4,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 1,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },

  // Week card
  weekCard: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  weekTitle: { fontSize: 15, fontWeight: "600", color: "#1e293b" },
  weekRange: { fontSize: 12, color: "#94a3b8" },
  weekStats: { flexDirection: "row", justifyContent: "space-around" },
  weekStat: { alignItems: "center", flex: 1 },
  weekStatDivider: { width: 1, backgroundColor: "#e2e8f0", marginVertical: 4 },
  weekStatValue: { fontSize: 22, fontWeight: "700", color: "#0D3B3B" },
  weekStatLabel: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  weekSummaryLink: { marginTop: 12, alignItems: "center" },
  weekSummaryLinkText: { fontSize: 14, color: "#6366f1", fontWeight: "500" },

  // Baseline card
  baselineCard: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: "#ede9fe",
    borderRadius: 16,
    padding: 20,
  },
  baselineLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6366f1",
    letterSpacing: 1,
    marginBottom: 6,
  },
  baselineTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  baselineSub: { fontSize: 14, color: "#475569", lineHeight: 20 },

  // MWI banner
  mwiBanner: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: "#0D3B3B",
    borderRadius: 16,
    padding: 20,
  },
  mwiBannerLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5bb8b8",
    letterSpacing: 1,
    marginBottom: 12,
  },
  mwiRow: { flexDirection: "row", alignItems: "center" },
  mwiPercent: { fontSize: 40, fontWeight: "800", color: "#fff" },
  mwiMeta: { marginLeft: 16 },
  mwiSub: { fontSize: 13, color: "#94a3b8", marginBottom: 4 },
  mwiCta: { fontSize: 14, color: "#5bb8b8", fontWeight: "500" },

  // Insight
  insightCard: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: "#fef9e7",
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  insightLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#92400e",
    letterSpacing: 1,
    marginBottom: 8,
  },
  insightText: { fontSize: 15, color: "#78350f", lineHeight: 22 },

  // Team
  teamCard: {
    marginHorizontal: 20,
    backgroundColor: "#ede9fe",
    borderRadius: 16,
    padding: 20,
  },
  teamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  teamName: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
  teamProgressPill: {
    backgroundColor: "#ddd6fe",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  teamProgressText: { fontSize: 12, fontWeight: "600", color: "#6366f1" },
  teamBar: {
    height: 8,
    backgroundColor: "#c4b5fd",
    borderRadius: 4,
    overflow: "hidden",
  },
  teamBarFill: { height: "100%", backgroundColor: "#6366f1", borderRadius: 4 },
  teamPercent: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 12,
  },
  teamMembers: { flexDirection: "row", gap: 8 },
  teamMember: { flex: 1, alignItems: "center" },
  teamMemberAvatar: { fontSize: 20, marginBottom: 2 },
  teamMemberName: { fontSize: 11, color: "#64748b", textAlign: "center" },
  teamMemberSteps: { fontSize: 11, fontWeight: "600", color: "#1e293b" },

  // Team empty
  teamEmptyCard: {
    marginHorizontal: 20,
    backgroundColor: "#ede9fe",
    borderRadius: 16,
    padding: 20,
  },
  teamEmptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  teamEmptySub: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
  },
  teamEmptyButtons: { flexDirection: "row", gap: 12 },
  teamCreateBtn: {
    flex: 1,
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  teamCreateBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  teamJoinBtn: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  teamJoinBtnText: { color: "#6366f1", fontWeight: "600", fontSize: 14 },

  // Quote
  quoteCard: { marginHorizontal: 20, marginTop: 16, padding: 20 },
  quoteText: {
    fontSize: 15,
    color: "#64748b",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 24,
  },

  // Actions
  actions: { marginHorizontal: 20, marginTop: 20, gap: 12 },
  primaryAction: {
    backgroundColor: "#0D3B3B",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryActionText: { color: "#fff", fontSize: 17, fontWeight: "600" },
  secondaryAction: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0D3B3B",
  },
  secondaryActionText: { color: "#0D3B3B", fontSize: 17, fontWeight: "600" },
});
